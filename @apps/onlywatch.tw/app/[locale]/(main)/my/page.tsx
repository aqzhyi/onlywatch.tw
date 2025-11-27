import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Text } from '~/components/Text'
import { auth } from '~/features/better-auth/auth'
import { ObserverCreateForm } from '~/features/tg-channels/components/ObserverCreateForm'
import { ObserverEditForm } from '~/features/tg-channels/components/ObserverEditForm'
import { RssFeedCreateForm } from '~/features/tg-channels/components/RssFeedCreateForm'
import { RssFeedEditForm } from '~/features/tg-channels/components/RssFeedEditForm'
import { findManyFeeds } from '~/features/tg-channels/db/findManyFeeds'
import { findManyObservers } from '~/features/tg-channels/db/findManyObservers'

export default async function Page(props: PageProps<'/[locale]/my'>) {
  const user = await auth.api.getSession({ headers: await headers() })

  if (!user?.user?.id) {
    redirect('/sign-in')
  }
  const { data: observers } = await findManyObservers({
    userId: user?.user?.id,
  })
  const { data: feeds } = await findManyFeeds({ userId: user?.user?.id })

  return (
    <div className='space-y-4'>
      <Text className='py-4 text-2xl font-bold'>✈️ 我的頻道</Text>
      <div className='space-y-2'>
        <ObserverCreateForm />
        {observers?.toReversed()?.map((observer) => {
          return (
            <div key={observer.id}>
              <ObserverEditForm observer={observer} />
            </div>
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
