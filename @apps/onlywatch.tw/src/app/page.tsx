import clsx from 'clsx'
import { EventCard } from '~/features/jin10/components/EventCard'
import { findManyEvents } from '~/features/jin10/server-actions/findManyEvents'
import { days } from '~/utils/days'

// export const dynamic = 'force-dynamic'
export const revalidate = 240

export default async function Home() {
  const { data, error } = await findManyEvents({
    fromAt: days().add(-3, 'days').startOf('days').format(),
    endAt: days().add(30, 'days').endOf('days').format(),
  })

  if (error) {
    return <div>🔴 ERROR 👉 {error.message}</div>
  }

  return (
    <div
      aria-label='頁面區塊'
      className='grid grid-cols-[repeat(75,252px)] gap-2 pl-2'
    >
      {Object.entries(data).map(([date, events]) => {
        const isHoliday = ['六', '日'].includes(days(date).format('dd'))
        const isToday = days(date).isSame(days(), 'day')
        const isBeforeToday = days(date).isBefore(days(), 'day')

        return (
          <div
            key={date}
            aria-label='日期區塊'
            className={clsx([
              'flex flex-col space-y-2',
              isHoliday && 'opacity-45',
              isBeforeToday && 'opacity-65',
            ])}
          >
            <div
              aria-label='日期'
              className={clsx([
                'text-2xl font-bold',
                isHoliday && 'text-blue-300',
                isBeforeToday && 'text-gray-400',
                isToday && 'text-emerald-400',
              ])}
            >
              <span>{days(date).format('MM月DD日 ddd')}</span>
              {isToday && <span className='text-xl'>(今天)</span>}
            </div>
            {events.map((event) => {
              return (
                <EventCard
                  key={event.id}
                  title={event.display_title}
                  datetime={event.publish_at}
                  country={event.country}
                  numbers={[
                    event.previous_number,
                    event.consensus_number,
                    event.actual_number,
                  ]}
                  unit={event.unit}
                ></EventCard>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
