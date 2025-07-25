'use server'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '~/db/getSupabaseServerClient'
import { envVars } from '~/envVars'

export async function signInWithGoogle() {
  /**
   * @see https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#saving-google-tokens
   */
  const refreshTokenQueryParams = {
    access_type: 'offline',
    prompt: 'consent',
  }

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${envVars.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
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
