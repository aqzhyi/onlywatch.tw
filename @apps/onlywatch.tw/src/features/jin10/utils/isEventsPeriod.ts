import { days } from '~/utils/days'

/**
 * 檢查指定時間是否為事件發布的高峰期
 *
 * 事件通常在每小時的 0、15、30、45 分鐘發布，但可能因重大公告而延遲發布
 *
 * @example
 *   isEventsPeriod('2023-10-03T08:00:00Z') // true (0分鐘是高峰期)
 *   isEventsPeriod('2023-10-03T08:05:00Z') // false (5分鐘不是高峰期)
 */
export function isEventsPeriod(isodate: string): boolean {
  const targetTime = days(isodate).tz('asia/taipei')
  const minute = targetTime.minute()

  // 事件發布的高峰時段（分鐘）
  const eventPeakMinutes = new Set([
    0,
    1,
    2,
    3, // 0分鐘附近
    15,
    16,
    17,
    18, // 15分鐘附近
    30,
    31,
    32,
    33, // 30分鐘附近
    45,
    46,
    47,
    48, // 45分鐘附近
  ])

  return eventPeakMinutes.has(minute)
}
