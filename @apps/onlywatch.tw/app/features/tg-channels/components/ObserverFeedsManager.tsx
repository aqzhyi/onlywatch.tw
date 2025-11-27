'use client'

import { Alert } from '@heroui/alert'
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Text } from '~/components/Text'
import type { Tables } from '~/db/database.types'
import { deleteObserverFeed } from '~/features/tg-channels/server-actions/deleteObserverFeed'
import { insertObserverFeed } from '~/features/tg-channels/server-actions/insertObserverFeed'
import { days } from '~/utils/days'

type SubscribedFeed = Tables<'tg_watchers'> & {
  tg_rss_feeds: Tables<'tg_rss_feeds'>
}

type ObserverFeedsManagerProps = {
  observer: Tables<'tg_observers'>
  subscribedFeeds: SubscribedFeed[]
  availableFeeds: Tables<'tg_rss_feeds'>[]
}

/**
 * Component for managing observer-feed subscriptions
 *
 * Allows adding and removing RSS feed subscriptions for a Telegram observer.
 * Shows list of subscribed feeds with remove buttons and a selector for adding
 * new subscriptions.
 *
 * @example
 *   ;<ObserverFeedsManager
 *     observer={observerData}
 *     subscribedFeeds={subscribedFeeds}
 *     availableFeeds={allFeeds}
 *   />
 *
 * @param props - Component props
 */
export function ObserverFeedsManager({
  observer,
  subscribedFeeds,
  availableFeeds,
}: ObserverFeedsManagerProps) {
  const router = useRouter()
  const [selectedFeedId, setSelectedFeedId] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Filter out already subscribed feeds
  const unsubscribedFeeds = availableFeeds.filter(
    (feed) => !subscribedFeeds.some((sub) => sub.tg_rss_feeds.id === feed.id),
  )

  const handleAddFeed = async () => {
    if (!selectedFeedId) return

    setIsAdding(true)
    setMessage(null)

    const { error } = await insertObserverFeed({
      observerId: observer.id,
      feedId: Number(selectedFeedId),
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: '訂閱成功' })
      setSelectedFeedId('')
      router.refresh()
    }

    setIsAdding(false)
  }

  const handleRemoveFeed = async (watcherId: number) => {
    setRemovingId(watcherId)
    setMessage(null)

    const { error } = await deleteObserverFeed({ watcherId })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: '已移除訂閱' })
      router.refresh()
    }

    setRemovingId(null)
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Section 1: Add subscription */}
      <Card className='hover:dark:border hover:dark:border-blue-700'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--rss-plus]' />
            <span className='text-lg font-bold'>新增訂閱來源</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className='flex flex-col items-center gap-3 sm:flex-row'>
            <Autocomplete
              label='選擇 RSS Feed'
              placeholder='輸入以搜尋 Feed...'
              selectedKey={selectedFeedId}
              onSelectionChange={(key) => {
                setSelectedFeedId(key?.toString() || '')
              }}
              isDisabled={isAdding || unsubscribedFeeds.length === 0}
              className='flex-1'
            >
              {unsubscribedFeeds.map((feed) => (
                <AutocompleteItem key={feed.id.toString()}>
                  {feed.title}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Button
              color='primary'
              startContent={<span className='icon-[mdi--plus-circle]' />}
              onPress={handleAddFeed}
              isLoading={isAdding}
              isDisabled={!selectedFeedId || isAdding}
            >
              新增訂閱
            </Button>
          </div>

          {unsubscribedFeeds.length === 0 && (
            <Alert
              color='default'
              title='所有可用的 Feed 都已訂閱'
              variant='flat'
            />
          )}
        </CardBody>
      </Card>

      {/* Message alert */}
      {message && (
        <Alert
          color={message.type === 'success' ? 'success' : 'danger'}
          title={message.text}
          variant='flat'
        />
      )}

      {/* Section 2: Subscribed feeds list */}
      <div>
        <Text className='text-2xl font-bold'>
          <div className='flex flex-row gap-2'>
            <span className='icon-[mdi--check-circle]' />
            <span>已訂閱的來源 ({subscribedFeeds.length})</span>
          </div>
        </Text>

        {subscribedFeeds.length === 0 ? (
          <Alert
            color='default'
            title='📭 尚未訂閱任何 RSS Feed'
            description='請從上方選單選擇要訂閱的來源'
            variant='flat'
          />
        ) : (
          <div className='flex flex-col gap-3'>
            {subscribedFeeds.map((item) => (
              <Card
                key={item.id}
                className={twMerge(
                  'hover:border-primary transition-colors',
                  removingId === item.id && 'opacity-50',
                )}
              >
                <CardBody>
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-start gap-2'>
                        <span className='icon-[mdi--rss] text-success mt-1' />
                        <div>
                          <div className='font-medium'>
                            {item.tg_rss_feeds.title}
                          </div>
                          <div className='text-default-500 text-sm'>
                            {decodeURI(item.tg_rss_feeds.feed_url)}
                          </div>
                          <div className='text-default-400 text-xs'>
                            建立於:{' '}
                            {days(item.created_at).format('YYYY-MM-DD HH:mm')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      size='sm'
                      color='danger'
                      variant='flat'
                      startContent={<span className='icon-[mdi--delete]' />}
                      onPress={() => handleRemoveFeed(item.id)}
                      isLoading={removingId === item.id}
                      isDisabled={removingId !== null}
                    >
                      移除
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
