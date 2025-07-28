import { range } from 'lodash'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import z from 'zod'
import { Button } from '~/components/Button'
import { EventManyCards } from '~/features/jin10/components/EventManyCards'
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

  return (
    <div className='flex flex-col gap-2 px-2 pb-2 md:flex-row md:gap-2'>
      <EventManyCards
        key={paramsData.dayAt}
        dayAt={paramsData.dayAt}
        value={events.dataGroupedByDate?.[paramsData.dayAt] || []}
      />

      <Link
        href='/calender'
        className='flex md:hidden'
      >
        <Button className='w-full'>查看完整日曆</Button>
      </Link>
    </div>
  )
}
