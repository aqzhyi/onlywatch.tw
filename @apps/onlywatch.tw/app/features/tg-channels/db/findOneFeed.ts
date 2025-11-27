import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

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
