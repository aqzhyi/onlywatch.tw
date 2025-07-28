import 'server-only'
import { range, sortBy } from 'lodash'
import { z } from 'zod'
import { type Tables } from '~/db/database.types'
import { crawlOneEvent } from '~/features/jin10/crawler/crawlOneEvent'
import { days } from '~/utils/days'

const schema = z.object({
  fromAt: z.union([z.iso.date(), z.string().length(0)]),
  endAt: z.union([z.iso.date(), z.string().length(0)]),
})

export const crawlManyEvents = async (params: z.infer<typeof schema>) => {
  const input = schema.parse(params)

  const fromAt = days(input.fromAt)
  const endAt = days(input.endAt)

  const daysDiff = fromAt.diff(endAt, 'day')

  let $$events: Tables<'jin10_events'>[] = []

  for await (const index of range(0, daysDiff)) {
    const events = await crawlOneEvent({
      dateAt: fromAt.add(Math.abs(index), 'day').format('YYYY-MM-DD'),
    })

    $$events = [...$$events, ...events]
  }

  $$events = sortBy($$events, (event) => days(event.publish_at).unix())

  // $$events.forEach((event) => {
  //   if (event.display_title?.includes('FOMC')) {
  //     console.info(`!!!🟢🟢🟢 `, {
  //       'title': event.display_title,
  //       'event.publish_at': event.publish_at,
  //     })
  //   }
  // })

  return $$events
}
