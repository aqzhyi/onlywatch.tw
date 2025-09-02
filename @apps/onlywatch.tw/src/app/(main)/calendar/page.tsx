import { Calendar } from '~/features/jin10/components/Calendar'
import { DayCard } from '~/features/jin10/components/DayCard'
import { ManyEventsDrawer } from '~/features/jin10/components/ManyEventsDrawer'
import { WeekdayTitle } from '~/features/jin10/components/WeekdayTitle'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { getIsoWeekdays } from '~/utils/getIsoWeekdays'

export default async function Page(
  props: PageProps<'/calendar'> & {
    searchParams: Promise<{
      q: undefined | string
    }>
  },
) {
  const weeks = await getIsoWeekdays(-2, 2, true)

  const eventsPromise = findManyEvents(
    weeks.at(0)!,
    weeks.at(-1)!,
    (await props.searchParams).q,
  )

  console.info(`!!!🟢🟢🟢 `, eventsPromise)

  return (
    <Calendar
      data={weeks}
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
      renderCell={function RenderCell({ isodate, index }) {
        return (
          <ManyEventsDrawer
            isodate={isodate}
            value={eventsPromise}
            toggleBy={
              <div>{isodate}</div>
              // <DayCard
              //   isodate={isodate}
              //   value={eventsPromise}
              //   // variant={
              //   //   new Map([
              //   //     [isToday, 'today'],
              //   //     [isPast, 'past'],
              //   //   ] as const).get(true) || undefined
              //   // }
              // />
            }
          ></ManyEventsDrawer>
        )
      }}
    ></Calendar>
  )
}
