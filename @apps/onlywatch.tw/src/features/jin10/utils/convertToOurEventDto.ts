import type { Tables } from '~/db/database.types'
import type { Jin10 } from '~/features/jin10/types'
import { countryNameToCountryCode } from '~/utils/countryNameToCountryCode'
import { countryNameToCurrencyName } from '~/utils/countryNameToCurrencyName'
import { days } from '~/utils/days'

/**
 * convert the response from the Jin10 http API to fit our database format
 */
export const convertToOurEventDto = (
  eventsOfJin10: (Jin10.Event | Jin10.Data)[],
): Tables<'jin10_events'>[] => {
  const eventsOfAll: Tables<'jin10_events'>[] = []

  const duplicatesCheckSet = new Set<string>()

  for (const datum of eventsOfJin10) {
    // Skip events with pending time status
    if ('time_status' in datum && datum.time_status === '待定') {
      continue
    }

    const currency = countryNameToCurrencyName(datum.country || '')
    const country = countryNameToCountryCode(datum.country || '')

    const displayText =
      'indicator_name' in datum
        ? datum.indicator_name
        : 'event_content' in datum
          ? datum.event_content
          : ''

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
    const id = `${currency}:${timeAt?.replace(/[\s:+-]/gi, '')}:${displayText}`

    if (duplicatesCheckSet.has(id)) {
      continue
    }

    eventsOfAll.push({
      id: String(id),
      country: currency,
      revised_number: revised || null,
      previous_number: previous || null,
      consensus_number: consensus || null,
      actual_number: actual || null,
      publish_at: timeAt || null,
      unit: unit || null,
      display_title: `${displayText}`,
      latest_updated_at: days().tz('UTC', true).toISOString(),
    })
    duplicatesCheckSet.add(id)
  }

  return eventsOfAll
}
