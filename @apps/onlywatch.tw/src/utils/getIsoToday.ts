import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { days } from '~/utils/days'

/**
 * @example
 *   // return a string in ISO date format
 *   '2025-01-01'
 */
export const getIsoToday = async () => {
  'use cache'

  cacheLife('hours')
  cacheTag('today')

  return days().startOf('days').format('YYYY-MM-DD')
}
