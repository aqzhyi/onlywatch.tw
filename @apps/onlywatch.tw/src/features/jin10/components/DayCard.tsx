import { Badge } from '@heroui/badge'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { use } from 'react'
import { twMerge } from 'tailwind-merge'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { Date } from '~/features/jin10/components/Date'
import type { findManyEvents } from '~/features/jin10/db/findManyEvents'

export async function DayCard(props: {
  isodate: string
  value: ReturnType<typeof findManyEvents>
  variant?: undefined | 'today' | 'past'
}) {
  const { variant, value, isodate } = props

  const { data } = use(value)

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
        variant === 'today' && [
          'border-2 border-teal-500',
          'dark:border dark:border-lime-500',
        ],
        variant === 'past' && ['opacity-50'],
      ])}
    >
      <CardHeader>
        <Date value={props.isodate} />
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
