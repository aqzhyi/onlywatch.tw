import { range } from 'lodash'
import { Suspense } from 'react'
import type { RenderProps } from '~/types/RenderProps'

export async function Calendar(props: {
  data: string[]
  renderHeadCell?: RenderProps<{
    index: number
  }>
  renderCell: RenderProps<{
    index: number
    isodate: string
  }>
}) {
  const { data = [], renderCell, renderHeadCell } = props

  return (
    <div>
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
            fallback={'loading...'}
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
