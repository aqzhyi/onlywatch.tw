import { Badge } from '@heroui/badge'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { twMerge } from 'tailwind-merge'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { Date } from '~/features/jin10/components/Date'
import type { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'
import { getIsoToday } from '~/utils/getIsoToday'

export async function DayCard({
  isodate,
  variant,
  ...props
}: {
  isodate: string
  value: ReturnType<typeof findManyEvents>
  variant?: undefined | 'today' | 'past'
}) {
  const { data } = await props.value

  const today = await getIsoToday()
  const isToday = isodate === today
  const isPast = days(isodate).isBefore(days(today), 'days')

  const countryEventCounts =
    data?.[isodate]
      ?.filter((event) => event.country)
      .reduce(
        (counts, event) => {
          const country = event.country!
          counts[country] = (counts[country] || 0) + 1
          return counts
        },
        {} as Record<string, number>,
      ) || {}

  return (
    <Card
      className={twMerge([
        'md:min-h-44',
        'w-full cursor-pointer',
        isToday && [
          'border-2 border-teal-500',
          'dark:border dark:border-lime-500',
        ],
        isPast && ['opacity-50'],
      ])}
    >
      <CardHeader>
        <Date value={isodate} />
      </CardHeader>
      <CardBody>
        <div className='flex flex-row flex-wrap gap-4'>
          {Object.entries(countryEventCounts).map(
            ([countryCode, eventCount]) => (
              <Badge
                key={countryCode}
                color='primary'
                content={eventCount}
              >
                <CountryFlag country={countryCode} />
              </Badge>
            ),
          )}
        </div>
      </CardBody>
    </Card>
  )
}
