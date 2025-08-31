import { days } from '~/utils/days'

export function isSlowMarket(isodate: string): boolean {
  const hour = days(isodate).tz('asia/taipei').hour()

  const slowMarketHours = [3, 4, 5, 6, 7, 12, 13]

  return slowMarketHours.includes(hour)
}
