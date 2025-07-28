import { range } from 'lodash'
import { EventManyCards } from '~/features/jin10/components/EventManyCards'
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

  const daysRange = range(FROM_DAYS, END_DAYS + 1).map((dayOffset) => {
    return days().add(dayOffset, 'days').format('YYYY-MM-DD')
  })

  return (
    <div className='flex flex-col px-2 pb-2 md:flex-row md:gap-2'>
      {daysRange.map((isodate, index) => {
        return (
          <EventManyCards
            key={isodate}
            dayAt={isodate}
            value={events.dataGroupedByDate?.[isodate] || []}
          />
        )
      })}
    </div>
  )
}
