import clsx from 'clsx'
import { range } from 'lodash'
import type { Tables } from '~/db/database.types'
import { DayCard } from '~/features/jin10/components/DayCard'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'

export const revalidate = 180

export default async function Page(props: {
  searchParams: Promise<{ q: string }>
}) {
  const END_DAYS = 30

  const today = days().startOf('days')

  /** always start from Monday */
  const startDay = days().startOf('weeks').add(1, 'days').startOf('days')
  const endDay = days().add(END_DAYS, 'days').endOf('weeks')

  const events = await findManyEvents({
    q: (await props.searchParams).q,
    startOf: startDay.toISOString(),
    endOf: endDay.toISOString(),
  })

  const dailyEventsInRange = new Map<string, Tables<'jin10_events'>[]>()

  for (const day of range(0, Math.abs(startDay.diff(endDay, 'days')))) {
    const dayKey = startDay.add(day, 'days').format('YYYY-MM-DD')

    dailyEventsInRange.set(dayKey, events.dataGroupedByDate?.[dayKey] || [])
  }

  /** string of monday, tuesday, wednesday etc */
  const weekdayTitles = range(0, 7).map((day) =>
    startDay.add(day, 'days').format('ddd'),
  )

  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-7'>
      {weekdayTitles.map((title) => (
        <div
          key={title}
          className={clsx(['text-center text-xl font-bold', 'hidden md:block'])}
        >
          {title}
        </div>
      ))}
      {Array.from(dailyEventsInRange.entries()).map(([dayAt, events]) => {
        const isHoliday = [0, 6].includes(days(dayAt).weekday())
        const isUpcoming = days(dayAt).isAfter(today)
        const isPast = days(dayAt).isBefore(today)
        const isToday = today.format('YYYY-MM-DD') === dayAt

        return (
          <DayCard
            key={dayAt}
            dayAt={dayAt}
            value={events}
            variant={
              new Map([
                [isToday, 'today'],
                [isPast, 'past'],
              ] as const).get(true) || undefined
            }
          />
        )
      })}
    </div>
  )
}
