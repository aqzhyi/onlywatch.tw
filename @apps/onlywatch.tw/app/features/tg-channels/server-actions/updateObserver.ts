'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'
import { auth } from '~/features/better-auth/auth'

const updateObserverSchema = z.object({
  id: z.number().int().positive(),
  tg_id: z.number().int({ message: 'Telegram ID must be an integer' }),
  tg_username: z
    .string()
    .min(1, { message: 'Telegram username cannot be empty' }),
  memo: z.string().nullable().optional(),
})

/**
 * Update a Telegram observer
 *
 * Validates user authentication and ownership before updating. Only the
 * observer owner can update their observer.
 *
 * @example
 *   const result = await updateObserver({
 *     id: 1,
 *     tg_id: -1002399427868,
 *     tg_username: '@updated_channel',
 *     memo: 'Updated description',
 *   })
 */
export async function updateObserver(params: {
  id: number
  tg_id: number
  tg_username: string
  memo?: null | string
}): Promise<{
  error: null | Error
  data: null | void | Tables<'tg_observers'>[]
}> {
  // Get current user session
  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    return { error: new Error('Unauthorized'), data: null }
  }

  // Validate input
  const parsed = updateObserverSchema.safeParse(params)
  if (!parsed.success) {
    return {
      error: new Error(parsed.error.issues[0]?.message || 'Validation failed'),
      data: null,
    }
  }

  // Check if observer exists and belongs to user
  const supabase = getSupabase()
  const { data: existingObserver, error: fetchError } = await supabase
    .from('tg_observers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (fetchError) {
    return { error: fetchError, data: null }
  }

  if (!existingObserver) {
    return { error: new Error('Observer not found'), data: null }
  }

  if (existingObserver.user_id !== userSession.user.id) {
    return { error: new Error('Forbidden'), data: null }
  }

  // Update the observer
  const { data: updatedData, error: updateError } = await supabase
    .from('tg_observers')
    .update({
      tg_id: parsed.data.tg_id,
      tg_username: parsed.data.tg_username,
      memo: parsed.data.memo ?? null,
    })
    .eq('id', parsed.data.id)
    .select('*')

  if (updateError) {
    return { error: updateError, data: null }
  }

  return { error: null, data: updatedData }
}
