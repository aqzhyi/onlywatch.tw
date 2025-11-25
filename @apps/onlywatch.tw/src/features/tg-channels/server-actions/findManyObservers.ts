'use server'

import { cacheLife } from 'next/cache'
import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'

export async function findManyObservers(): Promise<{
  error: null | Error
  data: null | Tables<'tg_observers'>[]
}> {
  'use cache'
  cacheLife('minutes')

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('tg_observers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { error, data: null }
  }

  return { error: null, data }
}
