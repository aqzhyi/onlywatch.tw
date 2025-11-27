import { range } from 'lodash'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { days } from '~/utils/days'

/**
 * @example
 *   // return strings in ISO date format
 *   ;['2025-01-01', '2025-01-02', ...rest]
 */
export const getIsoWeekdays = async (
  startOffset = 0,
  endOffset = 0,
  startAtMonday = false,
): Promise<string[]> => {
  'use cache'

  cacheLife('hours')
  cacheTag('today')

  const today = days()

  let startDay = today.add(startOffset, 'weeks').startOf('weeks')
  let endDay = today.add(endOffset, 'weeks').endOf('weeks')

  if (startAtMonday) {
    startDay = startDay.add(1, 'days')
    endDay = endDay.add(2, 'days')
  }

  const calendarRangedDates = range(
    0,
    Math.abs(startDay.diff(endDay, 'days')),
  ).map((day) => startDay.add(day, 'days').format('YYYY-MM-DD'))

  return calendarRangedDates
}
