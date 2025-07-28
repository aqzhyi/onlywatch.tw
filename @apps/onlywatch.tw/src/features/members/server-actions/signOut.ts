'use server'
import { getSupabaseSSR } from '~/db/getSupabaseSSR'

export async function signOut() {
  const supabase = await getSupabaseSSR()
  await supabase.auth.signOut()
}
