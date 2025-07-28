import clsx from 'clsx'
import { range } from 'lodash'
import { EventManyCards } from '~/features/jin10/components/EventManyCards'
import { LocaleDatetimeAt } from '~/features/jin10/components/LocaleDatetimeAt'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'

// export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function Page() {
  const FROM_DAYS = -3
  const END_DAYS = 15

  const events = await findManyEvents({
    fromAt: days().add(FROM_DAYS, 'days').startOf('days').toISOString(),
    endAt: days()
      .add(END_DAYS + 1, 'days')
      .endOf('days')
      .toISOString(),
  })

  const dayGrouped = range(FROM_DAYS, END_DAYS).map((day) => {
    const isodate = days()
      .tz('UTC')
      .add(day, 'days')
      .startOf('days')
      .toISOString()
    return isodate
  })

  return (
    <div className={`flex gap-2 pl-2`}>
      {dayGrouped.map((isodate, index) => {
        const isHoliday = ['六', '日'].includes(days(isodate).format('dd'))
        const isToday = days(isodate).isSame(days(), 'day')
        const isBeforeToday = days(isodate).isBefore(days(), 'day')

        return (
          <div
            key={isodate}
            aria-label='日期區塊'
            className={clsx([
              'flex min-w-64 flex-col space-y-2',
              isHoliday && 'opacity-50',
              isBeforeToday && 'opacity-50',
            ])}
          >
            <div
              className={clsx([
                'flex flex-row items-center space-x-2 text-2xl font-bold',
                isHoliday && 'text-blue-300',
                isBeforeToday && 'text-gray-400',
                isToday && 'text-emerald-400',
              ])}
            >
              <LocaleDatetimeAt
                value={isodate}
                format='MM月DD日 ddd'
                className='flex-2/3'
              />
              {isToday && (
                <div
                  aria-label='今天'
                  className='flex-1/3 text-xl'
                >
                  (今天)
                </div>
              )}
            </div>

            <EventManyCards
              dateAt={isodate}
              data={events}
            />
          </div>
        )
      })}
    </div>
  )
}
