import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

export async function findManyObservers(params?: {
  userId?: undefined | string
}): Promise<{
  error: null | Error
  data: null | Tables<'tg_observers'>[]
}> {
  const supabase = getSupabase().from('tg_observers').select('*').order('id')

  if (params?.userId) {
    supabase.eq('user_id', params.userId)
  }

  const { data, error } = await supabase.order('created_at', {
    ascending: false,
  })

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
