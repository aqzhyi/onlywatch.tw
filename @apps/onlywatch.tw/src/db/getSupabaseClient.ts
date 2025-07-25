import { createBrowserClient } from '@supabase/ssr'
import { Database } from '~/db/database.types'
import { envVars } from '~/envVars'

export const getSupabaseClient = () => {
  return createBrowserClient<Database>(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
