import { DayCard } from '~/features/jin10/components/DayCard'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'

export const revalidate = 180

export default async function Page() {
  const FROM_DAYS = -1
  const END_DAYS = 15

  const events = await findManyEvents({
    startOf: days().add(FROM_DAYS, 'days').startOf('days').toISOString(),
    endOf: days()
      .add(END_DAYS + 1, 'days')
      .endOf('days')
      .toISOString(),
  })

  return (
    <div className='grid grid-cols-1 gap-2'>
      {Object.entries(events.dataGroupedByDate || {}).map(
        ([dayAt, dayEvents]) => {
          const today = days().startOf('day')

          const isHoliday = [0, 6].includes(days(dayAt).weekday())
          const isUpcoming = days(dayAt).isAfter(today)
          const isPast = days(dayAt).isBefore(today)
          const isToday = today.format('YYYY-MM-DD') === dayAt

          return (
            <DayCard
              key={dayAt}
              dayAt={dayAt}
              value={dayEvents}
              variant={
                new Map([
                  [isUpcoming, 'upcoming'],
                  [isHoliday, 'holiday'],
                  [isPast, 'past'],
                  [isToday, 'today'],
                ] as const).get(true) || 'default'
              }
            />
          )
        },
      )}
    </div>
  )
}
