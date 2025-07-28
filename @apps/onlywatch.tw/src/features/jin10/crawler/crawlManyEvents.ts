import 'server-only'

import { range, sortBy } from 'lodash'
import { z } from 'zod'
import { type Tables } from '~/db/database.types'
import { crawlOneEvent } from '~/features/jin10/crawler/crawlOneEvent'
import { days } from '~/utils/days'

const schema = z.object({
  startOf: z.union([z.iso.date(), z.string().length(0)]),
  endOf: z.union([z.iso.date(), z.string().length(0)]),
})

export const crawlManyEvents = async (params: z.infer<typeof schema>) => {
  const input = schema.parse(params)

  const startOf = days(input.startOf)
  const endOf = days(input.endOf)

  const daysDiff = startOf.diff(endOf, 'day')

  let $$events: Tables<'jin10_events'>[] = []

  for await (const index of range(0, daysDiff)) {
    const events = await crawlOneEvent({
      dayAt: startOf.add(Math.abs(index), 'day').format('YYYY-MM-DD'),
    })

    $$events = [...$$events, ...events]
  }

  $$events = sortBy($$events, (event) => days(event.publish_at).unix())

  return $$events
}
