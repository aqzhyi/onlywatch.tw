import dayjsOrigin from 'dayjs'
import twLocale from 'dayjs/locale/zh-tw'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekday from 'dayjs/plugin/weekday'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjsOrigin.locale(twLocale)
dayjsOrigin.extend(isBetween)
dayjsOrigin.extend(isSameOrAfter)
dayjsOrigin.extend(isSameOrBefore)
dayjsOrigin.extend(relativeTime)
dayjsOrigin.extend(weekday)
dayjsOrigin.extend(utc)
dayjsOrigin.extend(timezone)

export const days = dayjsOrigin
