'use client'

import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { useRouter } from 'next/navigation'
import { Fragment, useReducer } from 'react'
import { Drawer } from '~/components/Drawer'
import type { Tables } from '~/db/database.types'
import { Date } from '~/features/jin10/components/Date'
import { EventCard } from '~/features/jin10/components/EventCard'

type DrawerOfManyEvents = {
  isodate: string
  toggleBy: React.ReactNode
  events: Tables<'jin10_events'>[]
}

export function ManyEventsDrawer({
  toggleBy,
  isodate,
  events,
}: DrawerOfManyEvents) {
  const router = useRouter()
  const [isDrawerOpen, toggleDrawerOpen] = useReducer(
    (isOpen) => !isOpen,
    false,
  )

  return (
    <Fragment>
      <div
        className='contents'
        aria-label={`點擊展開抽屜查看日期 ${isodate} 的所有事件`}
        onClick={() => {
          router.refresh()
          toggleDrawerOpen()
        }}
      >
        {toggleBy}
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        placement='right'
        onOpenChange={toggleDrawerOpen}
      >
        <DrawerContent>
          <DrawerHeader>
            <Date value={isodate} />
          </DrawerHeader>
          <DrawerBody>
            <div className='flex flex-col gap-2'>
              {events.map((event) => {
                return (
                  <EventCard
                    key={event.id}
                    title={event.display_title}
                    publishAt={event.publish_at}
                    country={event.country}
                    numbers={[
                      event.previous_number,
                      event.consensus_number,
                      event.actual_number,
                    ]}
                    unit={event.unit}
                  />
                )
              })}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  )
}
