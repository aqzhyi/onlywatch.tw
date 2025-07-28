import 'server-only'

import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '~/db/database.types'
import { envVars } from '~/envVars'

export const getSupabaseAdmin = () => {
  return createBrowserClient<Database>(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
