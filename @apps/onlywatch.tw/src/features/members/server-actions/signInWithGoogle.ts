'use server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabaseSSR } from '~/db/getSupabaseSSR'

export async function signInWithGoogle() {
  const headersList = await headers()
  const origin = headersList.get('origin')

  /**
   * @see https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#saving-google-tokens
   */
  const refreshTokenQueryParams = {
    access_type: 'offline',
    prompt: 'consent',
  }

  const supabase = await getSupabaseSSR()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      queryParams: {
        ...refreshTokenQueryParams,
      },
    },
  })

  if (error) {
    console.error('Google 登入錯誤:', error)
    redirect('/auth/error')
  }

  if (data.url) {
    redirect(data.url)
  }
}
