import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '~/db/getSupabaseServerClient'
import { envVars } from '~/envVars'

/**
 * @see https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=server#signing-users-in
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)
  const origin = envVars.NEXT_PUBLIC_BASE_URL
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'

  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = envVars.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
