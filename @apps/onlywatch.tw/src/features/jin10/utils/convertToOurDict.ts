import type { Tables } from '~/db/database.types'
import { constants } from '~/features/jin10/constants'

/**
 * jin10 has inconsistent terminology for similar events across different
 * countries
 *
 * this makes it quite inconvenient for searching and translating, so we need a
 * unified glossary
 *
 * ❗ here are some inconsistent naming examples from Jin10 👇
 *
 * - Jin10's title for the event "Japan's interest rate decision" is 「目標利率」
 * - Jin10's title for the event "UK interest rate decision" is 「利率決議」
 * - Jin10's title for the event "USA interest rate decision" is 「利率決定」
 */
export function convertToOurDict(
  data: Tables<'jin10_events'>[],
): Tables<'jin10_events'>[] {
  for (const { from, to } of constants.financialTermDict) {
    data = data.map((item) => {
      if (typeof item.display_title === 'string') {
        item.display_title = item.display_title.replace(from, to)
      }
      return item
    })
  }
  return data
}
