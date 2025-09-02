'use client'

import { use } from 'react'
import type { findManyEvents } from '~/features/jin10/db/findManyEvents'

type DrawerOfManyEvents = {
  toggleBy: React.ReactNode
  value: ReturnType<typeof findManyEvents>
}

export function ManyEventsDrawer({ value }: DrawerOfManyEvents) {
  const { data } = use(value)

  return (
    <div>
      <h2>ManyEventsDrawer (client component)</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
