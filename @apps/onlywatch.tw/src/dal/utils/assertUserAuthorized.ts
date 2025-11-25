import { headers } from 'next/headers'
import { auth } from '~/features/better-auth/auth'

export async function assertUserAuthorized() {
  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    throw new Error('Unauthorized')
  }

  return userSession
}
