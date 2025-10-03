'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '~/features/better-auth/server/auth'

export async function signInWithLINE() {
  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  try {
    const response = await auth.api.signInSocial({
      body: {
        provider: 'line',
        callbackURL: `${origin}/api/auth/callback/line`,
      },
    })

    if (response.url) {
      redirect(response.url)
    }
  } catch (error) {
    console.error('LINE 登入失敗：', error)
    redirect('/auth/error')
  }
}
