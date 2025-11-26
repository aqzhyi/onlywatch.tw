'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'
import { auth } from '~/features/better-auth/auth'

const insertObserverSchema = z.object({
  tg_id: z.number().int({ message: 'Telegram ID must be an integer' }),
  tg_username: z
    .string()
    .min(1, { message: 'Telegram username cannot be empty' }),
  memo: z.string().nullable().optional(),
})

/**
 * Insert a new Telegram observer
 *
 * Validates user authentication before inserting. The observer will be owned by
 * the authenticated user.
 *
 * @example
 *   const result = await insertObserver({
 *     tg_id: -1002399427868,
 *     tg_username: '@example_channel',
 *     memo: 'My channel description',
 *   })
 *   if (result.error) {
 *     console.error(result.error)
 *   } else {
 *     console.log('Observer created:', result.data)
 *   }
 */
export async function insertObserver(params: {
  tg_id: number
  tg_username: string
  memo?: null | string
}): Promise<{
  error: null | Error
  data: null | Tables<'tg_observers'>
}> {
  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    return { error: new Error('Unauthorized'), data: null }
  }

  const parsed = insertObserverSchema.safeParse(params)
  if (!parsed.success) {
    return {
      error: new Error(parsed.error.issues[0]?.message || 'Validation failed'),
      data: null,
    }
  }

  const supabase = getSupabase()
  const { data: insertedData, error: insertError } = await supabase
    .from('tg_observers')
    .insert({
      tg_id: parsed.data.tg_id,
      tg_username: parsed.data.tg_username,
      memo: parsed.data.memo ?? null,
      user_id: userSession.user.id,
    })
    .select('*')
    .single()

  if (insertError) {
    return { error: insertError, data: null }
  }

  return { error: null, data: insertedData }
}
