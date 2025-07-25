import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/db/database.types'
import { envVars } from '~/envVars'

const supabaseUrl = `https://${envVars.SUPABASE_PROJECT_ID}.supabase.co`

const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_KEY
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
