import { groupBy } from 'lodash'
import z from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabaseSSR } from '~/db/getSupabaseSSR'
import { constants } from '~/features/jin10/constants'
import { days } from '~/utils/days'

const propsSchema = z.object({
  fromAt: z.iso.datetime({ offset: false }),
  endAt: z.iso.datetime({ offset: false }),
})

/**
 * @example
 *   const { data, error } = await findManyEvents({
 *     fromAt: days().add(-3, 'days').startOf('days').toISOString(),
 *     endAt: days().add(30, 'days').endOf('days').toISOString(),
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

  const supabase = await getSupabaseSSR()

  const { data, error } = await supabase
    .from('jin10_events')
    .select('*')
    .gte('publish_at', input.data.fromAt)
    .lte('publish_at', input.data.endAt)
    .order('publish_at', { ascending: true })

  const dataGroupedByDate = data
    ? groupBy(data, (event) => {
        return days(event.publish_at)
          .tz('Asia/Taipei')
          .add(constants.timezoneOffset, 'hour')
          .format('YYYY-MM-DD')
      })
    : {}

  return { error: null, data: data || [], dataGroupedByDate }
}
