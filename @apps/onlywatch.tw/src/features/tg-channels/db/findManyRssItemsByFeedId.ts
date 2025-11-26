import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

/**
 * Find all RSS items for a specific feed
 *
 * Retrieves up to 100 RSS items ordered by publication date (newest first)
 *
 * @example
 *   const { data, error } = await findManyRssItemsByFeedId({ feedId: 123 })
 *
 * @param params - Query parameters
 * @returns Promise with error/data structure containing RSS items array
 */
export async function findManyRssItemsByFeedId(params: {
  feedId: number
}): Promise<{
  error: null | Error
  data: null | Tables<'tg_rss_items'>[]
}> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('tg_rss_items')
    .select('*')
    .eq('feed_id', params.feedId)
    .order('pub_date', { ascending: false })
    .limit(100)

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
