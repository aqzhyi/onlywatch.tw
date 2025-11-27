import { days } from '~/utils/days'

export function isWeekend(isodate: string): boolean {
  const day = days(isodate).tz('asia/taipei').weekday()
  return day === 0 || day === 6
}
