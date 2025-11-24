import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/(services)/database/types'
import { envVars } from '~/envVars'

export const database = createClient<Database>(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
