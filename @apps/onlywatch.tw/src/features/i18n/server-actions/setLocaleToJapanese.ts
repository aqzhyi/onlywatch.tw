'use server'

import { cookies } from 'next/headers'

export async function setLocaleToJapanese() {
  const cookie = await cookies()

  cookie.set('locale', 'ja')
}
