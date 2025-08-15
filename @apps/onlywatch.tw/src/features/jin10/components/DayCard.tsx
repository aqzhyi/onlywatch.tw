'use client'

import { Badge } from '@heroui/badge'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import clsx from 'clsx'
import { Fragment, useReducer } from 'react'
import type { Tables } from '~/db/database.types'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { EventCard } from '~/features/jin10/components/EventCard'

export function DayCard(props: {
  dayAt: string
  value: Tables<'jin10_events'>[]
  variant?: 'default' | 'today' | 'past' | 'upcoming'
}) {
  const { variant = 'default' } = props
  const [isDrawerOpen, toggleDrawerOpen] = useReducer((prev) => !prev, false)
  const countryEventCounts: Record<string, number> = {}

  for (const event of props.value) {
    if (event.country) {
      countryEventCounts[event.country] =
        (countryEventCounts[event.country] || 0) + 1
    }
  }

  const date = (
    <div
      className={clsx([
        'flex flex-row items-center gap-2',
        variant === 'today' && [
          'text-lg font-bold text-lime-500 dark:text-lime-400',
        ],
      ])}
    >
      <div className='icon-[mdi--calendar-outline]'></div>
      <div>{props.dayAt}</div>
    </div>
  )

  return (
    <Fragment>
      <Card
        className={clsx(['w-full cursor-pointer'])}
        isPressable
        onPress={toggleDrawerOpen}
      >
        <CardHeader>{date}</CardHeader>
        <CardBody>
          <div className='flex flex-row gap-2'>
            {Object.entries(countryEventCounts).map(
              ([countryCode, eventCount]) => (
                <Badge
                  key={countryCode}
                  color='primary'
                  content={eventCount}
                >
                  <CountryFlag country={countryCode} />
                </Badge>
              ),
            )}
          </div>
        </CardBody>
      </Card>
      <Drawer
        isOpen={isDrawerOpen}
        placement='right'
        onOpenChange={toggleDrawerOpen}
        classNames={{
          base: 'sm:m-2 rounded-medium',
          closeButton: 'text-2xl text-gray-900 dark:text-white',
        }}
      >
        <DrawerContent>
          <DrawerHeader>{date}</DrawerHeader>
          <DrawerBody>
            <div className='flex flex-col gap-2'>
              {props.value.map((event, index) => {
                return (
                  <Fragment key={event.id}>
                    <EventCard
                      title={event.display_title}
                      publishAt={event.publish_at}
                      country={event.country}
                      numbers={[
                        event.previous_number,
                        event.consensus_number,
                        event.actual_number,
                      ]}
                      unit={event.unit}
                    ></EventCard>
                  </Fragment>
                )
              })}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  )
}
