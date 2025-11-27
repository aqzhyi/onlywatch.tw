'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'
import { auth } from '~/features/better-auth/auth'
import { findOneFeed } from '~/features/tg-channels/db/findOneFeed'

const updateRssFeedSchema = z.object({
  id: z.number().int().positive(),
  feed_url: z.url({ message: 'Invalid URL format' }),
  title: z.string().min(1, { message: 'Title cannot be empty' }),
  enabled: z.boolean(),
})

/**
 * Update an RSS feed
 *
 * Validates user authentication and ownership before updating. Only the feed
 * owner can update their feed.
 */
export async function updateRssFeed(params: {
  id: number
  feed_url: string
  title: string
  enabled: boolean
}): Promise<{
  error: null | Error
  data: null | void | Tables<'tg_rss_feeds'>[]
}> {
  // Get current user session
  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    return { error: new Error('Unauthorized'), data: null }
  }

  // Validate input
  const parsed = updateRssFeedSchema.safeParse(params)
  if (!parsed.success) {
    return {
      error: new Error(parsed.error.issues[0]?.message || 'Validation failed'),
      data: null,
    }
  }

  // Check if feed exists and belongs to user
  const { data: existingFeed, error: fetchError } = await findOneFeed({
    id: params.id,
  })

  if (fetchError) {
    return { error: fetchError, data: null }
  }

  if (!existingFeed) {
    return { error: new Error('Feed not found'), data: null }
  }

  if (existingFeed.user_id !== userSession.user.id) {
    return { error: new Error('Forbidden'), data: null }
  }

  // Update the feed
  const supabase = getSupabase()
  const { data: updatedData, error: updateError } = await supabase
    .from('tg_rss_feeds')
    .update({
      feed_url: parsed.data.feed_url,
      title: parsed.data.title,
      enabled: parsed.data.enabled,
    })
    .eq('id', parsed.data.id)
    .select('*')

  if (updateError) {
    return { error: updateError, data: null }
  }

  return { error: null, data: updatedData }
}
