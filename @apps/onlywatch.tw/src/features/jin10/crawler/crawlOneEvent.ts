import 'server-only'

import axios from 'axios'
import { tifyJson } from 'chinese-conv/dist'
import { z } from 'zod'
import type { Tables } from '~/db/database.types'
import { envVars } from '~/envVars'
import type { Jin10 } from '~/features/jin10/types'
import { countryNameToCountryCode } from '~/utils/countryNameToCountryCode'
import { countryNameToCurrencyName } from '~/utils/countryNameToCurrencyName'
import { days } from '~/utils/days'

const schema = z.object({
  dayAt: z.iso.date(),
})

export async function crawlOneEvent(params: z.infer<typeof schema>) {
  const input = schema.parse(params)

  const dayAt = days(input.dayAt)
  const isValid = dayAt.isValid()

  if (!isValid) {
    throw new Error(
      `[expect] params.dateAt satisfies string [toMatch] YYYY-MM-DD [retrieve] ${input.dayAt} [typeof] ${typeof input.dayAt}`,
    )
  }

  const headers = {
    'Origin': envVars.JIN10_HEADER_ORIGIN,
    'Referer': envVars.JIN10_HEADER_ORIGIN,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
    'X-app-id': envVars.JIN10_APP_ID,
    'x-version': '2.0',
  }

  const {
    data: { data: events },
  } = await axios.get(`${envVars.JIN10_API_URL}/get/event`, {
    params: {
      category: 'cj',
      date: input.dayAt,
    },
    headers: headers,
  })

  const {
    data: { data },
  } = await axios.get(`${envVars.JIN10_API_URL}/get/data`, {
    params: {
      category: 'cj',
      date: input.dayAt,
    },
    headers: headers,
  })

  let ourEvents = convertJin10ToEconomicEvent(tifyJson([...events, ...data]))

  ourEvents = ourEvents.map((event) => {
    return {
      ...event,
      // the data fetched by the clawer here is in +0800 timezone,
      // so i need to convert it to utc timezone before saving to the database for consistent time zone handling
      publish_at: days(event.publish_at)
        .add(-8, 'hours')
        .tz('UTC', true)
        .toISOString(),
    }
  })

  // i don't care about some countries' economic data,
  // only about main economies like the usa, europe, the uk, and japan, and so on
  ourEvents = ourEvents.filter((event) => Boolean(event.country))

  return ourEvents
}

/**
 * the data from Jin10 needs to be changed to match our format
 */
const convertJin10ToEconomicEvent = (
  eventsOfJin10: (Jin10.Event | Jin10.Data)[],
): Tables<'jin10_events'>[] => {
  const eventsOfAll: Tables<'jin10_events'>[] = []

  for (const datum of eventsOfJin10) {
    if ('time_status' in datum && datum.time_status === '待定') {
      continue
    }

    const country = countryNameToCurrencyName(datum.country || '')
    const currency = countryNameToCountryCode(datum.country || '')

    const displayText =
      'indicator_name' in datum
        ? datum.indicator_name
        : 'event_content' in datum
          ? datum.event_content
          : ''

    const id = 'data_id' in datum ? datum.data_id : datum.id
    const revised = 'revised' in datum ? datum.revised : null
    const previous = 'previous' in datum ? datum.previous : null
    const consensus = 'consensus' in datum ? datum.consensus : null
    const actual = 'actual' in datum ? datum.actual : null
    const timeAt =
      'event_time' in datum
        ? datum.event_time
        : 'pub_time' in datum
          ? datum.pub_time
          : null
    const unit = 'unit' in datum ? datum.unit : null

    eventsOfAll.push({
      id: String(id),
      country: country,
      revised_number: revised || null,
      previous_number: previous || null,
      consensus_number: consensus || null,
      actual_number: actual || null,
      publish_at: timeAt || null,
      unit: unit || null,
      display_title: `${displayText}`,
    })
  }

  return eventsOfAll
}
