import { range } from 'lodash'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import type { RenderProps } from '~/types/RenderProps'

export async function Calendar<Data extends string[]>(props: {
  /**
   * @example
   *   data={['2025-01-01', '2025-01-02', '2025-01-03', ...rest]}
   */
  data: Data
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
          <Fragment key={isodate}>
            {renderCell({
              isodate,
              index,
            })}
          </Fragment>
        )
      })}
    </div>
  )
}
