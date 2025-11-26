'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'
import { auth } from '~/features/better-auth/auth'

const insertRssFeedSchema = z.object({
  feed_url: z.url({ message: 'Invalid URL format' }),
  title: z.string().min(1, { message: 'Title cannot be empty' }),
  enabled: z.boolean().optional().default(true),
})

/**
 * Insert a new RSS feed
 *
 * Validates user authentication before inserting. The feed will be owned by the
 * authenticated user.
 *
 * @example
 *   const result = await insertRssFeed({
 *     feed_url: 'https://example.com/feed.xml',
 *     title: 'Example Feed',
 *     enabled: true,
 *   })
 *   if (result.error) {
 *     console.error(result.error)
 *   } else {
 *     console.log('Feed created:', result.data)
 *   }
 */
export async function insertRssFeed(params: {
  feed_url: string
  title: string
  enabled?: boolean
}): Promise<{
  error: null | Error
  data: null | Tables<'tg_rss_feeds'>
}> {
  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    return { error: new Error('Unauthorized'), data: null }
  }

  const parsed = insertRssFeedSchema.safeParse(params)
  if (!parsed.success) {
    return {
      error: new Error(parsed.error.issues[0]?.message || 'Validation failed'),
      data: null,
    }
  }

  const supabase = getSupabase()
  const { data: insertedData, error: insertError } = await supabase
    .from('tg_rss_feeds')
    .insert({
      feed_url: parsed.data.feed_url,
      title: parsed.data.title,
      enabled: parsed.data.enabled,
      user_id: userSession.user.id,
    })
    .select('*')
    .single()

  if (insertError) {
    return { error: insertError, data: null }
  }

  return { error: null, data: insertedData }
}
