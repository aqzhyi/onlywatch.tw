import { Fragment } from 'react'
import { EventCard } from '~/features/jin10/components/EventCard'
import type { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'

export async function EventManyCards(props: {
  dateAt: string
  data: Awaited<ReturnType<typeof findManyEvents>>
}) {
  const { dataGroupedByDate } = props.data
  const events =
    dataGroupedByDate?.[days(props.dateAt).format('YYYY-MM-DD')] || []

  const hasEvents = events.length > 0

  return (
    <Fragment>
      {!hasEvents && <div>沒有數據與事件</div>}
      {events.map((event) => {
        return (
          <EventCard
            key={event.id}
            title={event.display_title}
            publishAt={event.publish_at}
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
    </Fragment>
  )
}
