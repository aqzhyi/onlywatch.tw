import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '~/db/database.types'
import { envVars } from '~/envVars'

export const getSupabase = () => {
  return createBrowserClient<Database>(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
