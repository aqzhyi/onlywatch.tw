'use server'

import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

type FeedObserverWithFeed = Tables<'tg_watchers'> & {
  tg_rss_feeds: Tables<'tg_rss_feeds'>
}

export async function findManyFeedObservers(params: {
  userId: string
  observerId: number
}): Promise<{
  error: null | Error
  data: null | FeedObserverWithFeed[]
}> {
  const supabase = getSupabase()

  // First, get the tg_observers record to retrieve tg_id
  const { data: observer, error: observerError } = await supabase
    .from('tg_observers')
    .select('tg_id')
    .eq('id', params.observerId)
    .eq('user_id', params.userId)
    .single()

  if (observerError) {
    // If observer not found, return empty array
    if (observerError.code === 'PGRST116') {
      return { error: null, data: [] }
    }
    return { error: observerError, data: null }
  }

  const { data, error } = await supabase
    .from('tg_watchers')
    .select(
      `
        *,
        tg_rss_feeds!inner (*)
      `,
    )
    .eq('tg_id', observer.tg_id)

  if (error) {
    return { error, data: null }
  }

  return { error: null, data: data as unknown as FeedObserverWithFeed[] }
}
