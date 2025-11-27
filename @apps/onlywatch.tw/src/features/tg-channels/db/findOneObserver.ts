'use server'

import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

/**
 * Find a single Telegram observer by ID
 *
 * Retrieves a single observer record from tg_observers table.
 *
 * @example
 *   const { data: observer, error } = await findOneObserver({ id: 123 })
 *
 * @param params - Query parameters
 * @returns Promise resolving to observer data or error
 */
export async function findOneObserver(params: { id: number }): Promise<{
  error: null | Error
  data: null | Tables<'tg_observers'>
}> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('tg_observers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
