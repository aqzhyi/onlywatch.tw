import { days } from '~/utils/days'

/** events are usually published at 0, 15, 30, and 45 minutes */
export function isEventsPeriod(isodate: string): boolean {
  const targetTime = days(isodate).tz('asia/taipei')
  const minute = targetTime.minute()

  /**
   * some events may experience delayed releases when major announcements are
   * made
   *
   * `null` represents the peak period for event publishing
   */
  const eventPublishPeriods = [
    null,
    null,
    null,
    null,
    4,
    5,
    null,
    null,
    null,
    null,
    10,
    11,
    12,
    13,
    14,
    null,
    null,
    null,
    null,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    null,
    null,
    null,
    null,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    null,
    null,
    null,
    null,
    49,
    null,
    null,
    null,
    null,
    54,
    55,
    56,
    57,
    58,
    59,
  ]

  return !eventPublishPeriods.includes(minute)
}
