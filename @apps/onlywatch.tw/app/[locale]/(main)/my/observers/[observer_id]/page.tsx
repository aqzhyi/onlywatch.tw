import { Alert } from '@heroui/alert'
import { Skeleton } from '@heroui/skeleton'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Text } from '~/components/Text'
import { auth } from '~/features/better-auth/auth'
import { ObserverFeedsManager } from '~/features/tg-channels/components/ObserverFeedsManager'
import { findManyFeeds } from '~/features/tg-channels/db/findManyFeeds'
import { findManyWatchers } from '~/features/tg-channels/db/findManyWatchers'
import { findOneObserver } from '~/features/tg-channels/db/findOneObserver'

export default async function Page(
  props: PageProps<'/[locale]/my/observers/[observer_id]'>,
) {
  const params = await props.params
  const { observer_id } = params

  const observerId = Number.parseInt(observer_id, 10)

  if (Number.isNaN(observerId)) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-4'>
        <Alert
          color='danger'
          title='無效的 Observer ID'
          variant='flat'
        />
      </div>
    )
  }

  const userSession = await auth.api.getSession({ headers: await headers() })

  if (!userSession?.user?.id) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-4'>
        <Alert
          color='danger'
          title='請先登入'
          variant='flat'
        />
      </div>
    )
  }

  const { data: observer, error: observerError } = await findOneObserver({
    id: observerId,
  })

  if (observerError || !observer) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-4'>
        <Alert
          color='danger'
          title='找不到該 Observer'
          variant='flat'
        />
      </div>
    )
  }

  if (observer.user_id !== userSession.user.id) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-4'>
        <Alert
          color='danger'
          title='您沒有管理此 Observer 的權限'
          variant='flat'
        />
      </div>
    )
  }

  const { data: subscribedFeeds, error: subscribedFeedsError } =
    await findManyWatchers({
      userId: userSession.user.id,
      observerId: observer.id,
    })

  const { data: allFeeds, error: allFeedsError } = await findManyFeeds({
    userId: userSession.user.id,
  })

  return (
    <div className='flex flex-col gap-4 p-4'>
      <Text className='text-2xl font-bold'>
        <div className='flex items-center justify-start gap-2'>
          <div className='icon-[mdi--broadcast]'></div>
          <div>管理訂閱來源</div>
        </div>
      </Text>

      <div className='bg-default-100 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='icon-[mdi--telegram]' />
          <span className='font-medium'>{observer.tg_username}</span>
        </div>
        {observer.memo && (
          <div className='text-default-500 mt-1 text-sm'>{observer.memo}</div>
        )}
      </div>

      <Suspense fallback={<Skeleton className='h-96 rounded-md' />}>
        {subscribedFeedsError || allFeedsError ? (
          <Alert
            color='danger'
            title='無法載入資料'
            variant='flat'
          />
        ) : (
          <ObserverFeedsManager
            observer={observer}
            subscribedFeeds={subscribedFeeds ?? []}
            availableFeeds={allFeeds ?? []}
          />
        )}
      </Suspense>
    </div>
  )
}
