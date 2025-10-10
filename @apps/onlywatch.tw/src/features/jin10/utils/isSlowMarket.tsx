import { days } from '~/utils/days'

export function isSlowMarket(isodate: string): boolean {
  const hour = days(isodate).tz('asia/taipei').hour()

  const slowMarketHours = new Set([0, 1, 3, 4, 5, 6, 7, 10, 12, 13, 16, 18])

  return slowMarketHours.has(hour)
}
