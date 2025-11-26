import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

export async function findManyObservers(userId?: string): Promise<{
  error: null | Error
  data: null | Tables<'tg_observers'>[]
}> {
  const supabase = getSupabase().from('tg_observers').select('*')

  if (userId) {
    supabase.eq('user_id', userId)
  }

  const { data, error } = await supabase.order('created_at', {
    ascending: false,
  })

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
