import 'server-only'

import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '~/db/database.types'
import { envSecretVars } from '~/envSecretVars'

export const getSupabaseAdmin = () => {
  return createBrowserClient<Database>(
    envSecretVars.NEXT_PUBLIC_SUPABASE_URL,
    envSecretVars.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
