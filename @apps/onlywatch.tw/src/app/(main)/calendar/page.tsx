import { Calendar } from '~/features/jin10/components/Calendar'
import { DayCard } from '~/features/jin10/components/DayCard'
import { ManyEventsDrawer } from '~/features/jin10/components/ManyEventsDrawer'
import { WeekdayTitle } from '~/features/jin10/components/WeekdayTitle'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'
import { getIsoToday } from '~/utils/getIsoToday'

export default async function Page(
  props: PageProps<'/calendar'> & {
    searchParams: Promise<{
      q: undefined | string
    }>
  },
) {
  const today = getIsoToday()

  return (
    <Calendar
      targetWeek={today}
      startOfWeek={-2}
      endOfWeek={2}
      classNames={{
        base: 'gap-2',
      }}
      renderHeadCell={function RenderHeadCell({ index }) {
        return (
          <WeekdayTitle
            key={index}
            value={index}
          />
        )
      }}
      renderCell={async function RenderCell({
        isodate,
        index,
        startOf,
        endOf,
      }) {
        const { dataGroupedByDate } = await findManyEvents(
          startOf,
          endOf,
          (await props.searchParams).q,
        )

        const events = dataGroupedByDate?.[isodate] || []

        const isPast = days(isodate).isBefore(await today)
        const isToday = (await today) === isodate

        return (
          <ManyEventsDrawer
            isodate={isodate}
            events={events}
            toggleBy={
              <DayCard
                dayAt={isodate}
                value={events}
                variant={
                  new Map([
                    [isToday, 'today'],
                    [isPast, 'past'],
                  ] as const).get(true) || undefined
                }
              />
            }
          ></ManyEventsDrawer>
        )
      }}
    ></Calendar>
  )
}
