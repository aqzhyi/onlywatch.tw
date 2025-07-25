'use server'
import { groupBy } from 'lodash'
import z from 'zod'
import { Tables } from '~/db/database.types'
import { supabase } from '~/db/supabase'
import { constants } from '~/features/jin10/constants'
import { days } from '~/utils/days'

const propsSchema = z.object({
  /** use an ISO8601 string without timezone offset */
  fromAt: z.iso.datetime({ offset: false }),
  /** use an ISO8601 string without timezone offset */
  endAt: z.iso.datetime({ offset: false }),
})

export async function findManyEvents(
  props: z.infer<typeof propsSchema>,
): Promise<{
  error: null | Error
  value: {
    [eventId: string]: Tables<'jin10_events'>[]
  }
}> {
  const input = propsSchema.safeParse(props)

  if (!input.success) {
    return { error: input.error, value: {} }
  }

  const { data, error } = await supabase
    .from('jin10_events')
    .select('*')
    .gte('publish_at', input.data.fromAt)
    .lte('publish_at', input.data.endAt)
    .order('publish_at', { ascending: true })

  const groupedData = data
    ? groupBy(data, (event) => {
        return days(event.publish_at)
          .tz('Asia/Taipei')
          .add(constants.timezoneOffset, 'hour')
          .format('YYYY-MM-DD')
      })
    : {}

  return { error: null, value: groupedData }
}
