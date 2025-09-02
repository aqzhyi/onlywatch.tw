import { Calendar } from '~/features/jin10/components/Calendar'
import { DayCard } from '~/features/jin10/components/DayCard'
import { ManyEventsDrawer } from '~/features/jin10/components/ManyEventsDrawer'
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
  const { q: query = '' } = await props.searchParams

  const eventsPromise = findManyEvents(query)

  return (
    <Calendar
      data={weeks}
      renderCell={function RenderCell({ isodate, index }) {
        return (
          <ManyEventsDrawer
            value={eventsPromise}
            toggleBy={<DayCard value={eventsPromise} />}
          />
        )
      }}
    />
  )
}
