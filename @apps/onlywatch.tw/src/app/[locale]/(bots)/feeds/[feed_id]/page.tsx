import { notFound } from 'next/navigation'
import { dal } from '~/dal/dal'
import { RssFeedEditForm } from '~/features/tg-channels/components/RssFeedEditForm'
import { findOneFeed } from '~/features/tg-channels/db/findOneFeed'

export default async function Page(
  props: PageProps<'/[locale]/feeds/[feed_id]'>,
) {
  const { params } = props
  const { feed_id } = await params

  const { session } = await dal.assertUserAuthorized()

  if (!session.userId) {
    notFound()
  }

  const feedIdNumber = Number.parseInt(feed_id, 10)

  if (Number.isNaN(feedIdNumber)) {
    notFound()
  }

  const { data: feed, error } = await findOneFeed({ id: feedIdNumber })

  if (error || !feed) {
    notFound()
  }

  if (feed.user_id !== session.userId) {
    notFound()
  }

  return (
    <div className='flex justify-center p-4'>
      <RssFeedEditForm feed={feed} />
    </div>
  )
}
