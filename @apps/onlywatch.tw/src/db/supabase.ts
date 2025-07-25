import { getSupabaseAdminClient } from '~/db/getSupabaseAdminClient'
import { getSupabaseClient } from '~/db/getSupabaseClient'

export const supabase = getSupabaseClient()
export const supabaseAdmin = getSupabaseAdminClient()
