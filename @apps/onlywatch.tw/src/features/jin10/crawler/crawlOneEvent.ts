import 'server-only'

import axios from 'axios'
import { tifyJson } from 'chinese-conv/dist'
import { z } from 'zod'
import { envVars } from '~/envVars'
import { convertToOurEventDto } from '~/features/jin10/utils/convertToOurEventDto'
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

  let ourEvents = convertToOurEventDto(tifyJson([...events, ...data]))

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
