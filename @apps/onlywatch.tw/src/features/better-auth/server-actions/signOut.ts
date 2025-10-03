'use server'

import { authClient } from '~/features/better-auth/authClient'

export async function signOut() {
  const res = await authClient.signOut()
}
