'use server'

import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

type FeedObserverWithFeed = Tables<'tg_watchers'> & {
  tg_rss_feeds: Tables<'tg_rss_feeds'>
}

export async function findManyWatchers(params: {
  userId: string
  observerId: number
}): Promise<{
  error: null | Error
  data: null | FeedObserverWithFeed[]
}> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('tg_watchers')
    .select(
      `
        *,
        tg_rss_feeds!inner (*)
      `,
    )
    .eq('observer_id', params.observerId)

  if (error) {
    return { error, data: null }
  }

  return { error: null, data: data as unknown as FeedObserverWithFeed[] }
}
