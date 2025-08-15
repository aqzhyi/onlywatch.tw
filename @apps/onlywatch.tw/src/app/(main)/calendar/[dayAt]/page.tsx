import { Badge } from '@heroui/badge'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { range } from 'lodash'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import z from 'zod'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { DayCard } from '~/features/jin10/components/DayCard'
import { findManyEvents } from '~/features/jin10/db/findManyEvents'
import { days } from '~/utils/days'

const paramsSchema = z.object({
  dayAt: z.iso.date(),
})

export const revalidate = 60

export async function generateStaticParams(): Promise<
  z.infer<typeof paramsSchema>[]
> {
  const staticParams: z.infer<typeof paramsSchema>[] = []

  for (const daysToAdd of range(0, 30)) {
    staticParams.push({
      dayAt: days().add(daysToAdd, 'days').format('YYYY-MM-DD'),
    })
  }

  return staticParams
}

export default async function Page({
  params,
}: {
  params: Promise<z.infer<typeof paramsSchema>>
}) {
  const { data: paramsData, success: paramsOk } = paramsSchema.safeParse(
    await params,
  )

  if (!paramsOk) {
    notFound()
  }

  const events = await findManyEvents({
    startOf: days(paramsData.dayAt)
      .add(-1, 'days')
      .startOf('days')
      .toISOString(),
    endOf: days(paramsData.dayAt).add(1, 'days').endOf('days').toISOString(),
  })

  const dayEvents = events.dataGroupedByDate?.[paramsData.dayAt] || []

  return (
    <Suspense fallback={<Skeleton />}>
      <DayCard
        dayAt={paramsData.dayAt}
        value={dayEvents}
      />
    </Suspense>
  )
}
