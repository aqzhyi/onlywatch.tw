import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

export async function findManyObservers(params?: {
  userId?: undefined | string
  observerType?: 'channel' | 'user'
}): Promise<{
  error: null | Error
  data: null | Tables<'tg_observers'>[]
}> {
  const supabase = getSupabase().from('tg_observers').select('*').order('id')

  if (params?.userId) {
    supabase.eq('user_id', params.userId)
  }

  const observerType = params?.observerType ?? 'user'

  if (observerType === 'channel') {
    // Telegram channel IDs start with -100 (e.g., -1001234567890)
    // Use numeric range filter instead of LIKE for bigint type
    supabase.lt('tg_id', -1_000_000_000)
  }

  const { data, error } = await supabase.order('created_at', {
    ascending: false,
  })

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
