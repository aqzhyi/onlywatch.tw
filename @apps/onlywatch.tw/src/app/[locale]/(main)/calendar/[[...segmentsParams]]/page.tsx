import { Skeleton } from '@heroui/skeleton'
import { parseSegments } from '@onlywatch/nextjs-route-segments-params/utils'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { Suspense } from 'react'
import { routing } from '~/features/i18n/routing'
import { Calendar } from '~/features/jin10/components/Calendar'
import { DayCard } from '~/features/jin10/components/DayCard'
import { ManyEventsDrawer } from '~/features/jin10/components/ManyEventsDrawer'
import { WeekdayTitle } from '~/features/jin10/components/WeekdayTitle'
import { constants } from '~/features/jin10/constants'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'
import { getIsoWeekdays } from '~/utils/getIsoWeekdays'

/**
 * 生成日期和關鍵字組合的靜態路由
 *
 * @complexity O(n * m) 其中 n 是日期數量，m 是關鍵字數量
 */
function generateDateKeywordCombinationRoutes(
  dates: string[],
): { params: string[] }[] {
  const combinationRoutes: { params: string[] }[] = []

  dates.forEach((date) => {
    constants.prerenderKeywordsResult.forEach((keyword) => {
      combinationRoutes.push({ params: ['date', date, 'query', keyword] })
    })
  })

  return combinationRoutes
}

export async function generateStaticParams() {
  const routes: { params: string[] }[] = []

  // 1. 預渲染默認路由
  routes.push({ params: [] })

  for (const locale of routing.locales) {
    routes.push({ params: [locale] })
  }

  // 2. 預渲染關鍵字路由
  const prerenderQueryKeywords = [
    ...constants.importantKeywordsPresets,
    ...constants.prerenderKeywordsResult,
  ]

  prerenderQueryKeywords.forEach((keyword) => {
    if (keyword) {
      routes.push({ params: ['query', keyword] })
    }
  })

  // 3. 預渲染重要的歷史日期
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

  importantDates.forEach((date) => {
    routes.push({ params: ['date', date] })
  })

  // 4. 預渲染一些重要日期 + 關鍵字的組合
  routes.push(...generateDateKeywordCombinationRoutes(importantDates))

  return routes
}

export default async function Page(
  props: PageProps<'/[locale]/calendar/[[...segmentsParams]]'>,
) {
  'use cache'
  cacheLife('minutes')

  const { segmentsParams = [] } = await props.params

  const params = parseSegments(['query', 'date'], segmentsParams)

  // 新的通用方式：使用泛型指定支援的參數類型
  // const parsedParams = await parseCatchAllParams<['query', 'date']>(props)

  // 開發模式調試
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 origin params:', segmentsParams)
    console.log('📊 parsed params:', params)
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
      renderHeadCell={function RenderHeadCell({ index }) {
        return (
          <WeekdayTitle
            key={index}
            value={index}
          />
        )
      }}
      renderCell={function RenderCell({ isodate, index }) {
        return (
          <Suspense fallback={<Skeleton className='min-h-44' />}>
            <ManyEventsDrawer
              isodate={isodate}
              value={eventsPromise}
              toggleBy={
                <DayCard
                  isodate={isodate}
                  value={eventsPromise}
                  variant={
                    params.date === isodate
                      ? 'today'
                      : days(isodate).isBefore(days(), 'day')
                        ? 'past'
                        : undefined
                  }
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
