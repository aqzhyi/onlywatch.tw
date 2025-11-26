import { Skeleton } from '@heroui/skeleton'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { Text } from '~/components/Text'
import { ObserverCard } from '~/features/tg-channels/components/ObserverCard'
import { findManyObservers } from '~/features/tg-channels/db/findManyObservers'

export default async function Page(props: PageProps<'/[locale]/channels'>) {
  return (
    <Suspense
      fallback={<Skeleton className={twMerge('h-full', 'rounded-md')} />}
    >
      <ChannelsGrid />
    </Suspense>
  )
}

async function ChannelsGrid() {
  const $t = await getTranslations()
  const { data: observers, error } = await findManyObservers({
    observerType: 'channel',
  })

  return (
    <div className='space-y-4'>
      <Text className='py-4 text-2xl font-bold'>📡 {$t('channels.title')}</Text>

      {error && (
        <Text
          variant='helper'
          className='text-danger'
        >
          {$t('channels.loadError')}: {error.message}
        </Text>
      )}

      {!error && (!observers || observers.length === 0) && (
        <Text variant='helper'>{$t('channels.noChannels')}</Text>
      )}

      {!error && observers && observers.length > 0 && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {observers.map((observer) => (
            <ObserverCard
              key={observer.id}
              value={observer}
            />
          ))}
        </div>
      )}
    </div>
  )
}
