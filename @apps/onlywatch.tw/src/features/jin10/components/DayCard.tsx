'use client'

import { Badge } from '@heroui/badge'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import clsx from 'clsx'
import { Fragment, useReducer } from 'react'
import type { Tables } from '~/db/database.types'
import { CountryFlag } from '~/features/jin10/components/CountryFlag'
import { Date } from '~/features/jin10/components/Date'
import { EventCard } from '~/features/jin10/components/EventCard'

export function DayCard(props: {
  dayAt: string
  value: Tables<'jin10_events'>[]
  variant?: undefined | 'today' | 'past'
}) {
  const { variant } = props
  const [isDrawerOpen, toggleDrawerOpen] = useReducer((prev) => !prev, false)
  const countryEventCounts: Record<string, number> = {}

  for (const event of props.value) {
    if (event.country) {
      countryEventCounts[event.country] =
        (countryEventCounts[event.country] || 0) + 1
    }
  }

  return (
    <Fragment>
      <Card
        className={clsx([
          'w-full cursor-pointer',
          variant === 'today' && [
            'border border-teal-500 dark:border-lime-500',
          ],
          variant === 'past' && ['opacity-50'],
        ])}
        isPressable
        onPress={toggleDrawerOpen}
      >
        <CardHeader>
          <Date value={props.dayAt} />
        </CardHeader>
        <CardBody>
          <div className='flex flex-row flex-wrap gap-4'>
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
          base: 'sm:m-4 rounded-large',
          closeButton: 'text-2xl text-gray-900 dark:text-white',
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <Date value={props.dayAt} />
          </DrawerHeader>
          <DrawerBody>
            <div className='flex flex-col gap-2'>
              {props.value.map((event) => {
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
