import 'server-only'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '~/db/database.types'
import { envVars } from '~/envVars'

export const getSupabaseAdminClient = () => {
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
