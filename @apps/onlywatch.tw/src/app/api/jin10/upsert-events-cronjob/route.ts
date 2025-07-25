import type { NextRequest } from 'next/server'
import type { Tables } from '~/db/database.types'
import { supabaseAdmin } from '~/db/supabase'
import { crawlManyEvents } from '~/features/jin10/crawler/crawlManyEvents'
import { days } from '~/utils/days'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)

    const fromAt =
      url.searchParams.get('fromAt') ||
      days().add(-1, 'days').startOf('day').format('YYYY-MM-DD')

    const endAt =
      url.searchParams.get('endAt') ||
      days().add(5, 'days').startOf('day').format('YYYY-MM-DD')

    const events = await crawlManyEvents({
      endAt,
      fromAt,
    })

    if (events.length === 0) {
      return Response.json({
        message: 'No events to process',
        count: 0,
      })
    }

    const { data: upsertedEvents, error } = await supabaseAdmin
      .from('jin10_events')
      .upsert(
        events.map(
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
        ),
        {
          onConflict: 'id',
          ignoreDuplicates: false,
        },
      )
      .select()

    if (error) {
      console.error('Supabase upsert error:', error)
      return Response.json(
        { error: 'Failed to upsert events', details: error.message },
        { status: 500 },
      )
    }

    return Response.json({
      message: 'Events processed successfully',
      count: upsertedEvents?.length || 0,
      value: upsertedEvents,
    })
  } catch (error) {
    console.error('API route error:', error)
    return Response.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
