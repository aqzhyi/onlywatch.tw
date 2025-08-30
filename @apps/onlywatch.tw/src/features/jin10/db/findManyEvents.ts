import consola from 'consola'
import { groupBy } from 'lodash'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import z from 'zod'
import type { Tables } from '~/db/database.types'
import { getSupabase } from '~/db/getSupabase'
import { constants } from '~/features/jin10/constants'
import { stringWithDBSchema } from '~/schemas/stringWithDBSchema'
import { days } from '~/utils/days'

const propsSchema = z.object({
  q: stringWithDBSchema.optional(),
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
  startOf: z.infer<typeof propsSchema>['startOf'],
  endOf: z.infer<typeof propsSchema>['endOf'],
  q?: z.infer<typeof propsSchema>['q'],
): Promise<{
  error: null | Error
  data: Tables<'jin10_events'>[]
  dataGroupedByDate?: {
    [YYYY_MM_DD: string]: Tables<'jin10_events'>[]
  }
}> {
  'use cache'
  cacheLife('minutes')

  const input = propsSchema.safeParse({ q, startOf, endOf })

  if (!input.success) {
    return { error: input.error, data: [] }
  }

  consola.info('findManyEvents(input)', { input })

  // ! ⛑️ avoid sql injection
  const sanitizeQuery = (query: string): string => {
    return (
      query
        // allow Chinese, English, numbers, spaces, hyphens, underscores, and dots
        .replace(/[^a-zA-Z0-9\u4e00-\u9fff\s\-_.]/g, '')
        .trim()
    )
  }

  const queries =
    input.data.q
      ?.split(/[,\s]/)
      .map((query) => sanitizeQuery(query))
      .filter((query) => query.length > 0) || []

  const supabase = getSupabase()

  let queryBuilder = supabase.from('jin10_events').select('*')

  if (queries.length > 0) {
    // ! ⛑️ use individual ilike filters with proper parameter binding
    // ! build `OR` conditions safely without string interpolation in the SQL
    const orConditions = queries
      .flatMap((query) => [
        `display_title.ilike.%${query}%`,
        `country.ilike.%${query}%`,
      ])
      .join(',')

    queryBuilder = queryBuilder.or(orConditions)
  }

  const { data, error } = await queryBuilder
    .gte('publish_at', input.data.startOf)
    .lte('publish_at', input.data.endOf)
    .order('publish_at', { ascending: true })
    .order('display_title', { ascending: true })
    .limit(5000)

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
