'use client'

import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Fragment, use, useReducer } from 'react'
import { Drawer } from '~/components/Drawer'
import type { Tables } from '~/db/database.types'
import { Date } from '~/features/jin10/components/Date'
import { EventCard } from '~/features/jin10/components/EventCard'
import type { findManyEvents } from '~/features/jin10/db/findManyEvents'

type DrawerOfManyEvents = {
  isodate: string
  toggleBy: React.ReactNode
  value: ReturnType<typeof findManyEvents>
}

export function ManyEventsDrawer({
  toggleBy,
  isodate,
  value,
}: DrawerOfManyEvents) {
  const $t = useTranslations()
  const [isDrawerOpen, toggleDrawerOpen] = useReducer(
    (isOpen) => !isOpen,
    false,
  )

  const { data } = use(value)

  return (
    <Fragment>
      <div
        className='contents'
        aria-label={`點擊展開抽屜查看日期 ${isodate} 的所有事件`}
        onClick={() => {
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
              {!data?.[isodate]?.length && <div>{$t('events.notFound')}</div>}
              {data?.[isodate]?.map((event) => {
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
