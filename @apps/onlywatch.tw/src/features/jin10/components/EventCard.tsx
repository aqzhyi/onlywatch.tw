import clsx from 'clsx'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { Datetime } from '~/features/jin10/components/Datetime'

export function EventCard(
  props: React.PropsWithChildren<{
    title: null | string
    country: null | string
    datetime: null | string
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

  return (
    <div
      aria-label='經濟數據事件展示卡片'
      className='w-[100%] rounded-xl border border-zinc-200 bg-white p-2 transition-all duration-200 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:dark:bg-zinc-700'
    >
      <div className='flex flex-row items-center gap-2'>
        <CountryFlag country={props.country} />
        <Datetime value={props.datetime} />
      </div>
      <div>{props.title}</div>
      <div className={clsx(hasNoNumbers && 'hidden')}>{numbers}</div>
    </div>
  )
}
