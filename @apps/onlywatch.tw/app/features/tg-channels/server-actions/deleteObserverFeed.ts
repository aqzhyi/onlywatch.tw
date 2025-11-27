'use server'

import { headers } from 'next/headers'
import { getSupabase } from '~/db/getSupabase'
import { auth } from '~/features/better-auth/auth'

/**
 * Delete an observer-feed relationship
 *
 * Removes a subscription between an observer and an RSS feed. Validates that
 * the observer belongs to the current user before deleting the relationship.
 *
 * @example
 *   const { error } = await deleteObserverFeed({ watcherId: 789 })
 *
 * @param params - Parameters containing the watcher ID to delete
 * @returns Promise resolving to error or null
 */
export async function deleteObserverFeed(params: {
  watcherId: number
}): Promise<{
  error: null | Error
}> {
  const supabase = getSupabase()
  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    return { error: new Error('Unauthorized: User not logged in') }
  }

  // Get the watcher record to find observer_id
  const { data: watcher, error: watcherError } = await supabase
    .from('tg_watchers')
    .select('observer_id')
    .eq('id', params.watcherId)
    .single()

  if (watcherError) {
    return { error: watcherError }
  }

  // Verify observer ownership
  const { data: observer, error: observerError } = await supabase
    .from('tg_observers')
    .select('user_id')
    .eq('id', watcher.observer_id)
    .single()

  if (observerError) {
    return { error: observerError }
  }

  if (observer.user_id !== userSession.user.id) {
    return {
      error: new Error('Forbidden: You do not own this observer'),
    }
  }

  // Delete the relationship
  const { error: deleteError } = await supabase
    .from('tg_watchers')
    .delete()
    .eq('id', params.watcherId)

  if (deleteError) {
    return { error: deleteError }
  }

  return { error: null }
}
