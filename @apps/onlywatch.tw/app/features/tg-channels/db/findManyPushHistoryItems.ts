import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

type PushHistoryWithItem = Tables<'tg_push_history'> & {
  tg_rss_items: Tables<'tg_rss_items'> & {
    tg_rss_feeds: Tables<'tg_rss_feeds'>
  }
}

export async function findManyPushHistoryItems(params: {
  observerId: number
  limit?: number
}): Promise<{
  error: null | Error
  data: null | PushHistoryWithItem[]
}> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('tg_push_history')
    .select(
      `
        *,
        tg_rss_items!inner (*, tg_rss_feeds!inner (*))
      `,
    )
    .eq('observer_id', params.observerId)
    .eq('status', 'success')
    .order('pushed_at', { ascending: false })
    .limit(params.limit ?? 5)

  if (error) {
    return { error, data: null }
  }

  return { error: null, data: data as unknown as PushHistoryWithItem[] }
}
