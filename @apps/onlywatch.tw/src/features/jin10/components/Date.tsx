import clsx from 'clsx'
import { days } from '~/utils/days'

export function Date(props: {
  /**
   * @example
   *   '2025-01-01'
   *   '2025-01-01T00:00:00Z'
   */
  value: string
  color?: undefined | 'green' | 'blue'
}) {
  const variants = new Map([
    [days().isSame(props.value, 'day'), 'today'],
    [[0, 6].includes(days(props.value).weekday()), 'holiday'],
  ] as const).get(true)

  return (
    <div
      className={clsx([
        'flex flex-row items-center gap-2',
        variants === 'today' && [
          'text-lg font-bold text-teal-500',
          'dark:text-lime-400',
        ],
        variants === 'holiday' && ['text-blue-400'],
      ])}
    >
      <div className='icon-[mdi--calendar-outline]'></div>
      <div>{props.value}</div>
    </div>
  )
}
