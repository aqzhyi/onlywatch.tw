'use server'

import { cookies } from 'next/headers'
import { routing } from '~/features/i18n/routing'

export async function getLocaleFromCookies() {
  const cookie = await cookies()

  const userSelectedLocale = cookie.get('locale')?.value as
    | undefined
    | typeof routing.defaultLocale

  const targetLocale = userSelectedLocale || routing.defaultLocale

  return targetLocale
}
