import { Card, CardBody } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { useTranslations } from 'next-intl'
import { twMerge } from 'tailwind-merge'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { Datetime } from '~/features/jin10/components/Datetime'

export function EventCard(
  props: React.PropsWithChildren<{
    title: null | string
    country: null | string
    publishAt: null | string
    numbers: [null | string, null | string, null | string]
    unit: null | string
  }>,
) {
  const $t = useTranslations()
  const hasNoNumbers = !props.numbers || props.numbers.every((n) => n === null)
  const noContent = ' ... '

  const hasPublished = !!props.numbers?.[2]

  const numbers = (
    <div className='flex flex-row items-center md:gap-2'>
      <Chip
        variant='bordered'
        size='sm'
        startContent={<span>{$t('events.previousNumber')}</span>}
      >
        <span title='前次公佈值'>{props.numbers?.[0] || noContent}</span>
      </Chip>
      <span className='icon-[mdi--keyboard-arrow-right]' />
      <Chip
        variant='bordered'
        size='sm'
        startContent={<span>{$t('events.consensusNumber')}</span>}
      >
        <span title='預測公布值'>{props.numbers?.[1] || noContent}</span>
      </Chip>
      <span className='icon-[mdi--keyboard-arrow-right]' />
      <Chip
        variant={'bordered'}
        color={hasPublished ? 'primary' : 'default'}
      >
        <span title='實際公佈值'>{props.numbers?.[2] || noContent}</span>
        <span className='text-sm'>{props.unit}</span>
      </Chip>
    </div>
  )

  if (!props.publishAt) return null

  return (
    <Card aria-label='數據內容卡片'>
      <CardBody
        className={twMerge([
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
          <Datetime value={props.publishAt} />
        </div>
        <div>{$t(`eventTitles.${props.title}` as any)}</div>
        <div className={twMerge([hasNoNumbers && 'hidden'])}>{numbers}</div>
      </CardBody>
    </Card>
  )
}
