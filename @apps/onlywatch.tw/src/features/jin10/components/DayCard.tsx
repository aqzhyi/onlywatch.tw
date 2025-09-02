import { use } from 'react'
import type { findManyEvents } from '~/features/jin10/db/findManyEvents'

export async function DayCard(props: {
  value: ReturnType<typeof findManyEvents>
}) {
  const { value } = props

  const { data } = use(value)

  return (
    <div>
      <h2>DayCard (server component)</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
