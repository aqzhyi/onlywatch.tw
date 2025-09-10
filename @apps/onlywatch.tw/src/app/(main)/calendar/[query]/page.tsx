import { Skeleton } from '@heroui/skeleton'
import delay from 'delay'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { Fragment, Suspense } from 'react'
import { envVars } from '~/envVars'
import { Calendar } from '~/features/jin10/components/Calendar'
import { DayCard } from '~/features/jin10/components/DayCard'
import { ManyEventsDrawer } from '~/features/jin10/components/ManyEventsDrawer'
import { WeekdayTitle } from '~/features/jin10/components/WeekdayTitle'
import { constants } from '~/features/jin10/constants'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'
import { getIsoWeekdays } from '~/utils/getIsoWeekdays'

export async function generateStaticParams() {
  const prerenderQueryKeywords = [
    '',
    ...constants.importantKeywordsPresets,
    ...constants.prerenderKeywordsResult,
  ]

  return prerenderQueryKeywords.map((keyword) => ({
    query: keyword,
  }))
}

export default async function Page(props: PageProps<'/calendar/[query]'>) {
  'use cache'
  cacheLife('minutes')

  const weeks = await getIsoWeekdays(-2, 2, true)

  const eventsPromise = findManyEvents(
    days(weeks.at(0)!).startOf('days').toISOString(),
    days(weeks.at(-1)!).endOf('days').toISOString(),
    decodeURIComponent(
      (await props.params).query.replace(/query/g, ' ').replace(/%20/g, ' '),
    ),
  )

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
          <Suspense fallback={<Skeleton className='min-h-44' />}>
            <ManyEventsDrawer
              isodate={isodate}
              value={eventsPromise}
              toggleBy={
                <DayCard
                  isodate={isodate}
                  value={eventsPromise}
                />
              }
            ></ManyEventsDrawer>
          </Suspense>
        )
      }}
    ></Calendar>
  )
}
