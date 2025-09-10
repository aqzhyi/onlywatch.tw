import to from 'await-to-js'
import consola from 'consola'
import { NextResponse, type NextRequest } from 'next/server'
import z from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabaseAdmin } from '~/db/getSupabaseAdmin.server-only'
import { envVars } from '~/envVars'
import { crawlManyEvents } from '~/features/jin10/crawler/crawlManyEvents'
import { isSlowMarket } from '~/features/jin10/utils/isSlowMarket'
import { isWeekend } from '~/features/jin10/utils/isWeekend'
import { days } from '~/utils/days'

const paramsSchema = z.strictObject({
  startOf: z.iso.date().optional(),
  endOf: z.iso.date().optional(),
})

const DEFAULT_START_OF = days().add(-2, 'days').format('YYYY-MM-DD')
const DEFAULT_END_OF = days().add(4, 'days').format('YYYY-MM-DD')

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const whenDev = envVars.NODE_ENV === 'development'
  const whenWeekend = isWeekend(days().toISOString())
  const whenSlowMarket = isSlowMarket(days().toISOString())

  if (!whenDev && (whenWeekend || whenSlowMarket)) {
    return NextResponse.json(
      { message: 'Today is weekend or slow market, skipping crawling.' },
      { status: 200 },
    )
  }

  const parsedParams = paramsSchema.safeParse(Object.fromEntries(searchParams))

  if (!parsedParams.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsedParams.error.issues },
      { status: 400 },
    )
  }

  const startOf = parsedParams.data.startOf
    ? days(parsedParams.data.startOf).startOf('day').format('YYYY-MM-DD')
    : DEFAULT_START_OF

  const endOf = parsedParams.data.endOf
    ? days(parsedParams.data.endOf).endOf('day').format('YYYY-MM-DD')
    : DEFAULT_END_OF

  const [crawlError, events] = await to(crawlManyEvents({ endOf, startOf }))

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
            latest_updated_at: event.latest_updated_at,
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
