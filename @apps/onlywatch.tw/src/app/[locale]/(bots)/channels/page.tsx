import { Alert } from '@heroui/alert'
import { Skeleton } from '@heroui/skeleton'
import { Suspense } from 'react'
import { ObserverCard } from '~/features/tg-channels/components/ObserverCard'
import { findManyObservers } from '~/features/tg-channels/db/findManyObservers'

export default async function NextPage(props: PageProps<'/[locale]/channels'>) {
  const { data: observers, error } = await findManyObservers()

  if (error) {
    return (
      <div className='flex items-center justify-center'>
        <Alert color='danger'>Error: {error.message}</Alert>
      </div>
    )
  }

  if (!observers || observers.length === 0) {
    return (
      <div className='flex items-center justify-center'>
        <Alert color='warning'>無擁有任何頻道</Alert>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
      {observers.map((observer) => (
        <Suspense
          key={observer.id}
          fallback={<Skeleton className='h-32' />}
        >
          <ObserverCard value={observer} />
        </Suspense>
      ))}
    </div>
  )
}
