import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '~/db/database.types'
import { envPublicVars } from '~/envPublicVars'

export const getSupabase = () => {
  return createBrowserClient<Database>(
    envPublicVars.NEXT_PUBLIC_SUPABASE_URL,
    envPublicVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
