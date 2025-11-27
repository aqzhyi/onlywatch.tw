'use server'

import { headers } from 'next/headers'
import { getSupabase } from '~/db/getSupabase'
import { auth } from '~/features/better-auth/auth'

/**
 * Insert a new observer-feed relationship
 *
 * Creates a new subscription linking an observer to an RSS feed. Validates that
 * the observer belongs to the current user before creating the relationship.
 *
 * @example
 *   const { error } = await insertObserverFeed({
 *     observerId: 123,
 *     feedId: 456,
 *   })
 *
 * @param params - Parameters containing observer and feed IDs
 * @returns Promise resolving to error or null
 */
export async function insertObserverFeed(params: {
  observerId: number
  feedId: number
}): Promise<{
  error: null | Error
}> {
  const supabase = getSupabase()
  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    return { error: new Error('Unauthorized: User not logged in') }
  }

  // Verify observer ownership
  const { data: observer, error: observerError } = await supabase
    .from('tg_observers')
    .select('user_id')
    .eq('id', params.observerId)
    .single()

  if (observerError) {
    return { error: observerError }
  }

  if (observer.user_id !== userSession.user.id) {
    return {
      error: new Error('Forbidden: You do not own this observer'),
    }
  }

  // Verify feed ownership
  const { data: feed, error: feedError } = await supabase
    .from('tg_rss_feeds')
    .select('user_id')
    .eq('id', params.feedId)
    .single()

  if (feedError) {
    return { error: feedError }
  }

  if (feed.user_id !== userSession.user.id) {
    return {
      error: new Error('Forbidden: You do not own this feed'),
    }
  }

  // Check if relationship already exists
  const { data: existing } = await supabase
    .from('tg_watchers')
    .select('id')
    .eq('observer_id', params.observerId)
    .eq('feed_id', params.feedId)
    .single()

  if (existing) {
    return { error: new Error('Subscription already exists') }
  }

  // Insert the relationship
  const { error: insertError } = await supabase.from('tg_watchers').insert({
    observer_id: params.observerId,
    feed_id: params.feedId,
  })

  if (insertError) {
    return { error: insertError }
  }

  return { error: null }
}
