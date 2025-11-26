import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { Tooltip } from '@heroui/tooltip'
import { Suspense } from 'react'
import { twJoin } from 'tailwind-merge'
import { Link } from '~/features/i18n/navigation'
import { findOneObserverByTgUsername } from '~/features/tg-channels/db/findOneObserverByTgUsername'
import { findManyPushHistoryItems } from '~/features/tg-channels/db/findManyPushHistoryItems'

type PageProps = {
  params: Promise<{
    locale: string
    tg_username: string
  }>
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { tg_username } = params

  const tgUsername = decodeURIComponent(tg_username)

  const { data: observer, error: observerError } =
    await findOneObserverByTgUsername({
      tgUsername,
    })

  if (observerError || !observer) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <p className='text-danger'>找不到該頻道</p>
      </div>
    )
  }

  const { data: historyItems, error: historyError } =
    await findManyPushHistoryItems({
      observerId: observer.id,
      limit: 50,
    })

  if (historyError) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <p className='text-danger'>錯誤: {historyError.message}</p>
      </div>
    )
  }

  const hasHistory = historyItems && historyItems.length > 0

  return (
    <div className='p-4'>
      <div className='mb-6'>
        <div className='flex flex-row items-center gap-4'>
          <div>
            <h1 className='text-2xl font-bold'>
              <a
                href={`https://t.me/${tgUsername.replace('@', '')}`}
                target='_blank'
                rel='noopener noreferrer'
                className={twJoin(
                  'text-blue-600',
                  'hover:underline',
                  'dark:text-yellow-400',
                )}
              >
                {tgUsername}
              </a>
            </h1>
            {observer.memo && (
              <div className='text-default-500 mt-2'>{observer.memo}</div>
            )}
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>📤 最近推播記錄</h2>
        {!hasHistory && <p className='text-default-500'>📭 尚無推播記錄</p>}
        {hasHistory &&
          historyItems.map((history) => (
            <Suspense
              key={history.id}
              fallback={<Skeleton className='h-32' />}
            >
              <Card>
                <CardHeader className='flex-col items-start gap-1'>
                  <h3 className='text-lg font-medium'>
                    <a
                      href={history.tg_rss_items.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={twJoin(
                        'inline-block self-start',
                        'text-blue-600',
                        'hover:underline',
                        'dark:text-yellow-400',
                      )}
                    >
                      {history.tg_rss_items.title}
                    </a>
                  </h3>
                  <div className='text-default-400 text-xs'>
                    {history.pushed_at &&
                      new Date(history.pushed_at).toLocaleString('zh-TW', {
                        timeZone: 'Asia/Taipei',
                      })}
                  </div>
                </CardHeader>
                <CardBody className='gap-2'>
                  <div className='text-default-600 text-sm'>
                    {history.tg_rss_items.description}
                  </div>

                  <div className='flex flex-row items-center gap-2'>
                    <Link
                      href={`/my/feeds/${history.tg_rss_items.tg_rss_feeds.id}`}
                      rel='noopener noreferrer'
                      className={twJoin('inline-block self-start')}
                    >
                      <Tooltip
                        content={'調整來源細節'}
                        placement='right'
                      >
                        <Button
                          startContent={
                            <span className='icon-[mdi--text-box-edit-outline]'></span>
                          }
                          className={twJoin(
                            'flex items-center self-end',
                            'text-sm text-blue-600',
                            'dark:text-yellow-400',
                          )}
                        >
                          {history.tg_rss_items.tg_rss_feeds.title}
                        </Button>
                      </Tooltip>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Suspense>
          ))}
      </div>
    </div>
  )
}
