'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'
import type { Tables } from '~/db/database.types'
import { EventCard } from '~/features/jin10/components/EventCard'
import { LocaleDatetimeAt } from '~/features/jin10/components/LocaleDatetimeAt'
import { days } from '~/utils/days'

export function EventManyCards(props: {
  /**
   * @example
   *   '2025-08-11'
   */
  dayAt: string
  value: Tables<'jin10_events'>[]
}) {
  const { dayAt } = props

  const isHoliday = ['六', '日'].includes(days(dayAt).format('dd'))
  const isToday = days(dayAt).isSame(days(), 'day')
  const isBeforeToday = days(dayAt).isBefore(days(), 'day')

  const hasEvents = props.value.length > 0
  const events = props.value || []

  const targetEvent = events.reduce(
    (closest, current) => {
      const now = days()
      const currentDiff = Math.abs(days(current.publish_at).diff(now))
      const closestDiff = closest
        ? Math.abs(days(closest.publish_at).diff(now))
        : Infinity
      return currentDiff < closestDiff ? current : closest
    },
    null as Tables<'jin10_events'> | null,
  )

  return (
    <div
      key={dayAt}
      aria-label='日期區塊'
      className={clsx([
        'flex min-w-64 flex-col space-y-2 md:w-64',
        isHoliday && 'opacity-50',
        isBeforeToday && 'opacity-50',
      ])}
    >
      <Link href={`/calender/${days(dayAt).format('YYYY-MM-DD')}`}>
        <div
          className={clsx([
            'flex flex-row items-center space-x-2 text-2xl font-bold',
            isHoliday && 'text-blue-300',
            isBeforeToday && 'text-gray-400',
            isToday && 'text-emerald-400',
          ])}
        >
          <LocaleDatetimeAt
            value={dayAt}
            format='MM月DD日 ddd'
            className='min-w-36 md:flex-2/3'
          />
          {isToday && (
            <div
              aria-label='今天'
              className='text-xl md:flex-1/3'
            >
              (今天)
            </div>
          )}
        </div>
      </Link>

      <div className='flex flex-col gap-2'>
        {!hasEvents && <div>沒有數據與事件</div>}
        {events.map((event, index) => {
          const shouldHasDivision = targetEvent?.id === event.id

          return (
            <Fragment key={event.id}>
              {isToday && shouldHasDivision && (
                <div className='flex h-[1px] border border-amber-600' />
              )}

              <EventCard
                key={event.id}
                title={event.display_title}
                publishAt={event.publish_at}
                country={event.country}
                numbers={[
                  event.previous_number,
                  event.consensus_number,
                  event.actual_number,
                ]}
                unit={event.unit}
              ></EventCard>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
