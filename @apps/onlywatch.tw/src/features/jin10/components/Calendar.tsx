import { Skeleton } from '@heroui/skeleton'
import { range } from 'lodash'
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import type { RenderProps } from '~/types/RenderProps'
import { days } from '~/utils/days'

export async function Calendar(props: {
  data: string[]
  renderHeadCell?: RenderProps<{
    index: number
  }>
  renderCell: RenderProps<{
    index: number
    /**
     * @example
     *   '2025-01-01'
     */
    isodate: string
  }>
  classNames?: {
    base?: string
  }
}) {
  const { data = [], renderCell, renderHeadCell } = props

  return (
    <div
      data-classnames='base'
      className={twMerge(
        'grid grid-cols-1 md:grid-cols-7',
        props.classNames?.base,
      )}
    >
      {renderHeadCell &&
        range(0, 7).map((index) => {
          return renderHeadCell({
            index,
          })
        })}
      {data.map((isodate, index) => {
        return (
          <Suspense
            key={isodate}
            fallback={<Skeleton className='w-full md:min-h-44' />}
          >
            {renderCell({
              isodate,
              index,
            })}
          </Suspense>
        )
      })}
    </div>
  )
}
