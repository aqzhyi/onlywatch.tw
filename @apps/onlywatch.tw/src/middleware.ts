import { getSessionCookie } from 'better-auth/cookies'
import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '~/features/i18n/routing'

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  // ⛑️ THIS IS NOT SECURE!
  // ⛑️ This is the recommended approach to optimistically redirect users
  // ⛑️ We recommend handling auth checks in each page/route
  // TODO: create a DAL abstraction layer to be used in every required route, server actions, and API to check the accessToken status
  if (
    !sessionCookie &&
    !request.nextUrl.pathname.startsWith('/sign-in') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
