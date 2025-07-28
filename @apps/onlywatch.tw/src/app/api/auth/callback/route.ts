import consola from 'consola'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseSSR } from '~/db/getSupabaseSSR'
import { envVars } from '~/envVars'
import { isValidRedirectUrl } from '~/utils/isValidRedirectUrl'

/**
 * ! please be careful about `open redirect` attacks
 *
 * @see https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=server#signing-users-in
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  /** if "next" is in param, use it as the redirect URL */
  let next = searchParams.get('next') ?? '/'

  // ! here check `open redirect` attacks
  if (!isValidRedirectUrl(next, origin)) {
    next = '/'
  }

  if (code) {
    const supabase = await getSupabaseSSR()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      /** original origin before load balancer */
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = envVars.NODE_ENV === 'development'

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      // error handling
      consola.error('Authentication error', error)
      return NextResponse.redirect(
        `${origin}/auth/error?error=${encodeURIComponent(error.message)}`,
      )
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
