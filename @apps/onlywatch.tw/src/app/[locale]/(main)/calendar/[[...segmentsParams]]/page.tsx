import { Skeleton } from '@heroui/skeleton'
import { parseSegments } from '@onlywatch/nextjs-route-segments-params/utils'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { Suspense } from 'react'
import { envPublicVars } from '~/envPublicVars'
import { routing } from '~/features/i18n/routing'
import { Calendar } from '~/features/jin10/components/Calendar'
import { DayCard } from '~/features/jin10/components/DayCard'
import { ManyEventsDrawer } from '~/features/jin10/components/ManyEventsDrawer'
import { WeekdayTitle } from '~/features/jin10/components/WeekdayTitle'
import { constants } from '~/features/jin10/constants'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'
import { getIsoWeekdays } from '~/utils/getIsoWeekdays'

type RoutePropsParams = Partial<
  Awaited<PageProps<'/[locale]/calendar/[[...segmentsParams]]'>['params']>
>

export async function generateStaticParams() {
  const routes: RoutePropsParams[] = []

  // 預渲染關鍵字路由
  const prerenderQueryKeywords = [
    ...constants.importantKeywordsPresets,
    ...constants.prerenderKeywordsResult,
  ]

  // 預渲染重要的歷史日期
  const importantDates = [
    // 最近 12 個月的每月 15 日
    days().subtract(12, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(11, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(10, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(9, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(8, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(7, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(6, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(5, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(4, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(3, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(2, 'month').date(15).format('YYYY-MM-DD'),
    days().subtract(1, 'month').date(15).format('YYYY-MM-DD'),
  ]

  // `[locale]` 是必要的最上層路由參數
  for (const locale of routing.locales) {
    // 預渲染默認路由
    routes.push({ locale })
    routes.push({ locale, segmentsParams: [] })

    for (const keyword of prerenderQueryKeywords) {
      routes.push({ locale, segmentsParams: ['query', keyword] })
    }

    for (const date of importantDates) {
      routes.push({ locale, segmentsParams: ['date', date] })
    }

    // 預渲染一些重要日期 + 關鍵字的組合
    for (const date of importantDates) {
      for (const keyword of prerenderQueryKeywords) {
        routes.push({
          locale,
          segmentsParams: ['date', date, 'query', keyword],
        })
      }
    }
  }

  return routes
}

export default async function Page(
  props: PageProps<'/[locale]/calendar/[[...segmentsParams]]'>,
) {
  'use cache'
  cacheLife('minutes')

  const { segmentsParams = [] } = await props.params

  const params = parseSegments(['query', 'date'], segmentsParams)

  // 開發模式調試
  if (envPublicVars.NODE_ENV === 'development') {
    console.log('📊 props.params:', {
      segments: segmentsParams,
      parsed: params,
    })
  }

  // 計算週範圍
  const weeks = await _calculateWeekRange(params.date)

  // 查詢事件數據
  const eventsPromise = findManyEvents(
    days(weeks.at(0)!).startOf('days').toISOString(),
    days(weeks.at(-1)!).endOf('days').toISOString(),
    params.query,
  )

  return (
    <Calendar
      data={weeks}
      classNames={{
        base: 'gap-2',
      }}
      renderHeadCell={HeadCell}
      renderCell={function RenderCell({ isodate, index }) {
        const variant = _getDayCardVariant(isodate, params.date)

        return (
          <Suspense fallback={<Skeleton className='min-h-44' />}>
            <ManyEventsDrawer
              isodate={isodate}
              value={eventsPromise}
              toggleBy={
                <DayCard
                  isodate={isodate}
                  value={eventsPromise}
                  variant={variant}
                />
              }
            />
          </Suspense>
        )
      }}
    />
  )
}

/**
 * 取得日曆卡片的顯示變體
 *
 * @example
 *   _getDayCardVariant('2025-01-15', '2025-01-15') // 'today'
 *   _getDayCardVariant('2025-01-14', '2025-01-15') // 'past'
 *   _getDayCardVariant('2025-01-16', '2025-01-15') // undefined
 */
function _getDayCardVariant(
  isodate: string,
  selectedDate?: string,
): 'today' | 'past' | undefined {
  if (selectedDate === isodate) {
    return 'today'
  }

  const isPastDay = days(isodate).isBefore(days(), 'day')
  if (isPastDay) {
    return 'past'
  }

  return undefined
}

function HeadCell({ index }: { index: number }) {
  return (
    <WeekdayTitle
      key={index}
      value={index}
    />
  )
}

/**
 * 計算顯示的週範圍
 *
 * @param targetDate 目標日期，如果為空則使用當前日期
 * @returns 週日期陣列
 */
async function _calculateWeekRange(targetDate?: string): Promise<string[]> {
  if (!targetDate) {
    // 沒有指定日期，使用當前日期前後 2 週
    return await getIsoWeekdays(-2, 2, true)
  }

  // 有指定日期，臨時設置該日期為"今天"，然後計算前後 2 週
  // 這裡我們需要計算目標日期與當前日期的週數差異
  const target = days(targetDate)
  const today = days()
  const weeksDiff = target.diff(today, 'weeks')

  return await getIsoWeekdays(weeksDiff - 2, weeksDiff + 2, true)
}
