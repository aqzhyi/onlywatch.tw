import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '~/db/database.types'
import { envVars } from '~/envVars'

/**
 * in next.js server-side and API route, you need to create a new supabase
 * client for each request
 */
export async function getSupabaseSSR() {
  const cookieStore = await cookies()

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient<Database>(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
