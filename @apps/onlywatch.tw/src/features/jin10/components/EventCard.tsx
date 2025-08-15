import { Card, CardBody } from '@heroui/card'
import clsx from 'clsx'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { LocaleDatetimeAt } from '~/features/jin10/components/LocaleDatetimeAt'

export function EventCard(
  props: React.PropsWithChildren<{
    title: null | string
    country: null | string
    publishAt: null | string
    numbers: [null | string, null | string, null | string]
    unit: null | string
  }>,
) {
  const hasNoNumbers = !props.numbers || props.numbers.every((n) => n === null)
  const noContent = ' ... '

  const numbers = (
    <div className='flex flex-row items-center gap-2'>
      <span>{props.numbers?.[0] || noContent}</span>
      <span>|</span>
      <span>{props.numbers?.[1] || noContent}</span>
      <span>|</span>
      <span>{props.numbers?.[2] || noContent}</span>
      <span className='text-sm'>{props.unit}</span>
    </div>
  )

  if (!props.publishAt) return null

  return (
    <Card aria-label='數據內容卡片'>
      <CardBody
        className={clsx([
          'p-2',
          'transition-all duration-200',
          'hover:border-zinc-300 hover:bg-zinc-200',
          'dark:border-zinc-800 dark:bg-zinc-900',
          'dark:hover:border-zinc-700 dark:hover:bg-zinc-700',
        ])}
      >
        <div className='flex flex-row items-center gap-2'>
          <CountryFlag country={props.country} />
          <span className='text-sm dark:text-zinc-400'>({props.country})</span>
          <LocaleDatetimeAt
            value={props.publishAt}
            format='MM/DD HH:mm'
            className='w-full'
          />
        </div>
        <div>{props.title}</div>
        <div className={clsx(hasNoNumbers && 'hidden')}>{numbers}</div>
      </CardBody>
    </Card>
  )
}
