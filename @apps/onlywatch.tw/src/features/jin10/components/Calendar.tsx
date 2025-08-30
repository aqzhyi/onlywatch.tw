import { Skeleton } from '@heroui/skeleton'
import { range } from 'lodash'
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import type { RenderProps } from '~/types/RenderProps'
import { days } from '~/utils/days'

export async function Calendar(props: {
  /**
   * The target week to display
   *
   * @example
   *   '2025-01-01T12:00:00Z'
   *
   * @example
   *   '2025-01-01'
   */
  targetWeek: string | Promise<string>
  /**
   * Number of weeks to display from
   *
   * @default -2
   */
  startOfWeek?: number
  /**
   * Number of weeks to display
   *
   * @default 3
   */
  endOfWeek?: number
  renderHeadCell?: RenderProps<{
    index: number
  }>
  renderCell: RenderProps<{
    index: number
    /**
     * @example
     *   '2025-01-01'
     */
    isodate: string
    startOf: string
    endOf: string
  }>
  classNames?: {
    base?: string
  }
}) {
  const { startOfWeek = -2, endOfWeek = 3, targetWeek, renderHeadCell } = props

  const startDay = days(await targetWeek)
    .add(startOfWeek, 'weeks')
    .startOf('weeks')
    // start from Monday
    .add(1, 'days')

  const endDay = days(await targetWeek)
    .add(endOfWeek, 'weeks')
    .endOf('weeks')
    // end on Sunday
    .add(2, 'days')

  const calendarRangedDates = range(
    0,
    Math.abs(startDay.diff(endDay, 'days')),
  ).map((day) => startDay.add(day, 'days').format('YYYY-MM-DD'))

  const startOfDay = startDay.toISOString()
  const endOfDay = endDay.toISOString()

  return (
    <div
      data-classnames='base'
      className={twMerge(
        'grid grid-cols-1 md:grid-cols-7',
        props.classNames?.base,
      )}
    >
      {renderHeadCell &&
        range(0, 7).map((index) => {
          return renderHeadCell({
            index,
          })
        })}
      {calendarRangedDates.map((isodate, index) => {
        return (
          <Suspense
            key={isodate}
            fallback={<Skeleton className='w-full md:min-h-44' />}
          >
            {props.renderCell({
              isodate,
              index,
              startOf: startOfDay,
              endOf: endOfDay,
            })}
          </Suspense>
        )
      })}
    </div>
  )
}
