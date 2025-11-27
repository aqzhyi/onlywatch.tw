import { Alert } from '@heroui/alert'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Link } from '@heroui/link'
import type { Tables } from '~/db/database.types'
import { days } from '~/utils/days'

type RssFeedItemsListProps = {
  items: Tables<'tg_rss_items'>[]
}

/**
 * Display list of RSS feed items
 *
 * Shows feed items in minimal card design with title, pub date, and truncated
 * description. Empty state shows alert message.
 *
 * @example
 *   ;<RssFeedItemsList items={feedItems} />
 *
 * @param props - Component props containing feed items array
 */
export function RssFeedItemsList({ items }: RssFeedItemsListProps) {
  if (items.length === 0) {
    return (
      <Alert
        color='default'
        title='此 Feed 尚未收錄任何 Items'
        variant='flat'
      />
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      {items.map((item) => (
        <Card
          key={item.id}
          className='hover:border-primary transition-colors'
        >
          <CardHeader className='flex-col items-start gap-1 pb-2'>
            <Link
              href={item.link}
              isExternal
              className='text-base font-medium'
              showAnchorIcon
            >
              {item.title}
            </Link>
            <div className='text-default-400 text-xs'>
              {days(item.pub_date).format('YYYY-MM-DD HH:mm')}
            </div>
          </CardHeader>
          <CardBody className='pt-0'>
            <div className='text-default-600 line-clamp-3 text-sm'>
              {item.description}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
