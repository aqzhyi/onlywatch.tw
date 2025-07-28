import to from 'await-to-js'
import consola from 'consola'
import { NextResponse, type NextRequest } from 'next/server'
import z from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabaseAdmin } from '~/db/getSupabaseAdmin.server-only'
import { crawlManyEvents } from '~/features/jin10/crawler/crawlManyEvents'
import { days } from '~/utils/days'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const fromAt =
    searchParams.get('fromAt') ||
    days().add(-2, 'days').startOf('day').format('YYYY-MM-DD')

  const endAt =
    searchParams.get('endAt') ||
    days().add(4, 'days').startOf('day').format('YYYY-MM-DD')

  const [crawlError, events] = await to(
    crawlManyEvents({
      endAt,
      fromAt,
    }),
  )

  if (events?.length === 0) {
    return Response.json({
      message: 'No events to process',
      count: 0,
    })
  }

  if (crawlError) {
    consola.error('Crawl error', crawlError)

    return NextResponse.json(
      { error: 'Failed to crawl events', details: crawlError.message },
      { status: 400 },
    )
  }

  const supabase = getSupabaseAdmin()

  const { data: upsertedEvents, error: upsertError } = await supabase
    .from('jin10_events')
    .upsert(
      events?.map(
        (event) =>
          ({
            id: event.id,
            country: event.country,
            display_title: event.display_title,
            publish_at: event.publish_at,
            actual_number: event.actual_number,
            consensus_number: event.consensus_number,
            previous_number: event.previous_number,
            revised_number: event.revised_number,
            unit: event.unit,
          }) satisfies Tables<'jin10_events'>,
      ) || [],
      {
        onConflict: 'id',
        ignoreDuplicates: false,
      },
    )
    .select()

  if (upsertError) {
    consola.error('Supabase upsert error', upsertError)

    return NextResponse.json(
      { error: 'Failed to upsert events', details: upsertError.message },
      { status: 500 },
    )
  }

  return NextResponse.json({
    message: 'Events processed successfully',
    count: upsertedEvents?.length || 0,
    value: upsertedEvents,
  })
}
