'use server'

import { cookies } from 'next/headers'

export async function setLocaleToTaiwan() {
  const cookie = await cookies()

  cookie.set('locale', 'zh-tw')
}
