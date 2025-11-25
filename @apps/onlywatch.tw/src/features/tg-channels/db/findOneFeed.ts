import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

/**
 * Find a single RSS feed by ID
 *
 * @example
 *   const result = await findFeedById({ id: 123 })
 *   if (result.error) {
 *     console.error('Error:', result.error)
 *   } else {
 *     console.log('Feed:', result.data)
 *   }
 *
 * @param params - Object containing the feed ID
 * @returns Promise with feed data or error
 */
export async function findOneFeed(params: { id: number }): Promise<{
  error: null | Error
  data: null | Tables<'tg_rss_feeds'>
}> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('tg_rss_feeds')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
