import { Alert } from '@heroui/alert'
import { Skeleton } from '@heroui/skeleton'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Text } from '~/components/Text'
import { auth } from '~/features/better-auth/auth'
import { RssFeedEditForm } from '~/features/tg-channels/components/RssFeedEditForm'
import { RssFeedItemsList } from '~/features/tg-channels/components/RssFeedItemsList'
import { findManyRssItemsByFeedId } from '~/features/tg-channels/db/findManyRssItemsByFeedId'
import { findOneFeed } from '~/features/tg-channels/db/findOneFeed'

export default async function Page(
  props: PageProps<'/[locale]/my/feeds/[feed_id]'>,
) {
  const params = await props.params
  const { feed_id } = params

  const feedId = Number.parseInt(feed_id, 10)

  if (Number.isNaN(feedId)) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-4'>
        <Alert
          color='danger'
          title='無效的 Feed ID'
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
          title='您沒有編輯此 Feed 的權限'
          variant='flat'
        />
      </div>
    )
  }

  const { data: feed, error } = await findOneFeed({ id: feedId })

  if (error || !feed) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-4'>
        <Alert
          color='danger'
          title='找不到該 Feed'
          variant='flat'
        />
      </div>
    )
  }

  if (feed.user_id !== userSession.user.id) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-4'>
        <Alert
          color='danger'
          title='您沒有編輯此 Feed 的權限'
          variant='flat'
        />
      </div>
    )
  }

  const { data: feedItems, error: feedItemsError } =
    await findManyRssItemsByFeedId({ feedId })

  return (
    <div className='flex flex-col gap-4 p-4'>
      <Text className='text-2xl font-bold'>
        <div className='flex items-center justify-start gap-2'>
          <div className='icon-[mdi--text-box-edit-outline]'></div>
          <div>編輯 Feed</div>
        </div>
      </Text>

      <Suspense fallback={<Skeleton className='h-32 rounded-md' />}>
        <RssFeedEditForm feed={feed} />
      </Suspense>

      <Text className='text-2xl font-bold'>
        <div className='flex items-center justify-start gap-2'>
          <div className='icon-[mdi--rss]'></div>
          <div>Feed Items</div>
        </div>
      </Text>

      <Suspense fallback={<Skeleton className='h-64 rounded-md' />}>
        {feedItemsError ? (
          <Alert
            color='danger'
            title='無法載入 Feed Items'
            variant='flat'
          />
        ) : (
          <RssFeedItemsList items={feedItems ?? []} />
        )}
      </Suspense>
    </div>
  )
}
