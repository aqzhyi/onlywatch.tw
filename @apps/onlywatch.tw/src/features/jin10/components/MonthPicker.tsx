import { Chip } from '@heroui/chip'
import { Input } from '@heroui/input'
import { twMerge } from 'tailwind-merge'
import { days } from '~/utils/days'

type MonthPickerProps = {
  /**
   * `z.iso.date` string
   *
   * @example
   *   value={'2025-09-15'}
   */
  value: undefined | string
  onValueChange?: (newValue: string) => void
}

export function MonthPicker({ onValueChange, value }: MonthPickerProps) {
  return (
    <Input
      type='text'
      label='跳轉至日期'
      placeholder='YYYY-MM-DD'
      variant='bordered'
      value={value || ''}
      onValueChange={(newValue) => {
        if (onValueChange) {
          onValueChange(newValue)
        }
      }}
      description={
        <div className='flex flex-col justify-center gap-2'>
          <div
            className={twMerge(
              'flex flex-row items-center gap-2',
              'font-bold',
              'text-zinc-600 dark:text-zinc-100',
            )}
          >
            <div className='flex flex-row flex-wrap items-center gap-2'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                const isCurrentMonth =
                  value?.replace(/\d{4}-([\s\S]+)-\d{2}$/, '$1') ===
                  days()
                    .set('month', month - 1)
                    .format('MM')

                return (
                  <Chip
                    key={month}
                    className={'cursor-pointer'}
                    color={isCurrentMonth ? 'success' : 'default'}
                    variant='dot'
                    size='sm'
                    onClick={() => {
                      const now = days()

                      onValueChange?.(
                        now
                          .set('month', month - 1)
                          .set('date', 15)
                          .format('YYYY-MM-DD'),
                      )
                    }}
                  >
                    {month} 月
                  </Chip>
                )
              })}
            </div>
          </div>
        </div>
      }
      pattern='^\d{4}-\d{2}-\d{2}$'
      errorMessage='請提供正確的日期格式，例如 2025-01-01'
      isClearable
    />
  )
}
