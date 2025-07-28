import { groupBy } from 'lodash'
import z from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'
import { constants } from '~/features/jin10/constants'
import { days } from '~/utils/days'

const propsSchema = z.object({
  startOf: z.iso.datetime({ offset: false }),
  endOf: z.iso.datetime({ offset: false }),
})

/**
 * @example
 *   const { data, error } = await findManyEvents({
 *     startOf: days().add(-3, 'days').startOf('days').toISOString(),
 *     endOf: days().add(15, 'days').endOf('days').toISOString(),
 *   })
 */
export async function findManyEvents(
  props: z.infer<typeof propsSchema>,
): Promise<{
  error: null | Error
  data: Tables<'jin10_events'>[]
  dataGroupedByDate?: {
    [YYYY_MM_DD: string]: Tables<'jin10_events'>[]
  }
}> {
  const input = propsSchema.safeParse(props)

  if (!input.success) {
    return { error: input.error, data: [] }
  }

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('jin10_events')
    .select('*')
    .gte('publish_at', input.data.startOf)
    .lte('publish_at', input.data.endOf)
    .order('publish_at', { ascending: true })
    .order('display_title', { ascending: true })

  const dataGroupedByDate = data
    ? groupBy(data, (event) => {
        return days(event.publish_at)
          .add(8, 'hours')
          .tz('UTC', true)
          .add(constants.timezoneOffset, 'hour')
          .format('YYYY-MM-DD')
      })
    : {}

  return { error: null, data: data || [], dataGroupedByDate }
}
