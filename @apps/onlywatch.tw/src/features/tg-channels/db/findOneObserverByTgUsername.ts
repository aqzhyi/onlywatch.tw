import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

export async function findOneObserverByTgUsername(params: {
  tgUsername: string
}): Promise<{
  error: null | Error
  data: null | Tables<'tg_observers'>
}> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('tg_observers')
    .select('*')
    .eq('tg_username', params.tgUsername)
    .single()

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
