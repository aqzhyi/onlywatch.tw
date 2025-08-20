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
  return (
    <div
      className={clsx([
        'flex flex-row items-center gap-2',
        props.color === 'green' && [
          'text-lg font-bold text-lime-500',
          'dark:text-lime-400',
        ],
        props.color === 'blue' && ['text-blue-400'],
      ])}
    >
      <div className='icon-[mdi--calendar-outline]'></div>
      <div>
        {props.value} ({days(props.value).format('ddd')})
      </div>
    </div>
  )
}
