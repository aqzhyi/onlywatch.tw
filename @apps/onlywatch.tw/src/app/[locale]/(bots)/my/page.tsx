import { headers } from 'next/headers'
import { Text } from '~/components/Text'
import { auth } from '~/features/better-auth/auth'
import { ObserverCard } from '~/features/tg-channels/components/ObserverCard'
import { RssFeedCreateForm } from '~/features/tg-channels/components/RssFeedCreateForm'
import { RssFeedEditForm } from '~/features/tg-channels/components/RssFeedEditForm'
import { findManyFeeds } from '~/features/tg-channels/db/findManyFeeds'
import { findManyObservers } from '~/features/tg-channels/db/findManyObservers'

export default async function Page(props: PageProps<'/[locale]/my'>) {
  const user = await auth.api.getSession({ headers: await headers() })
  const { data: observers } = await findManyObservers()
  const { data: feeds } = await findManyFeeds({ userId: user?.user?.id })

  return (
    <div className='space-y-4'>
      <Text className='py-4 text-2xl font-bold'>✈️ 我的頻道</Text>
      <div className='grid grid-cols-3 gap-4'>
        {observers?.map((observer) => {
          return (
            <ObserverCard
              key={observer.id}
              value={observer}
            />
          )
        })}
      </div>

      <Text className='py-4 text-2xl font-bold'>✈️ 我的推播來源</Text>
      <div className='space-y-2'>
        <RssFeedCreateForm />
        {feeds?.toReversed()?.map((feed) => {
          return (
            <div key={feed.id}>
              <RssFeedEditForm feed={feed} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
