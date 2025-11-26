import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

export async function findManyFeeds(params?: {
  userId?: undefined | string
}): Promise<{
  error: null | Error
  data: null | Tables<'tg_rss_feeds'>[]
}> {
  const supabase = getSupabase()

  let query = supabase.from('tg_rss_feeds').select('*')

  if (params?.userId) {
    query = query.eq('user_id', params.userId)
  }

  const { data, error } = await query

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
