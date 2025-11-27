'use client'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import { NumberInput } from '@heroui/react'
import { Switch } from '@heroui/switch'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import type { Tables } from '~/db/database.types'
import { updateRssFeed } from '~/features/tg-channels/server-actions/updateRssFeed'

type RssFeedEditFormProps = {
  feed: Tables<'tg_rss_feeds'>
}

type FormValues = {
  id: number
  feedUrl: string
  title: string
  enabled: boolean
}

/**
 * Form component for editing RSS feed details
 *
 * Allows editing of feed_url, title, and enabled status. Shows success/error
 * messages after submission.
 *
 * @example
 *   ;<RssFeedEditForm feed={feedData} />
 *
 * @param props - Component props containing the feed data
 */
export function RssFeedEditForm({ feed }: RssFeedEditFormProps) {
  const router = useRouter()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      id: feed.id,
      feedUrl: decodeURI(feed.feed_url),
      title: feed.title,
      enabled: feed.enabled,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setMessage(null)

    const { data: updatedData, error } = await updateRssFeed({
      id: data.id,
      feed_url: encodeURI(data.feedUrl),
      title: data.title,
      enabled: data.enabled,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Update failed' })
      return
    }

    setMessage({ type: 'success', text: 'Feed updated successfully' })
    router.refresh()
  }

  return (
    <Card
      className={twMerge(
        'w-full',
        'hover:dark:border hover:dark:border-yellow-700',
      )}
    >
      <CardBody>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <div className='flex items-center gap-3'>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  isRequired
                  label='標題'
                  placeholder='我的 RSS 新聞源'
                  value={field.value}
                  onValueChange={field.onChange}
                  isDisabled={isSubmitting}
                  className='flex-1'
                />
              )}
            />

            <Controller
              name='feedUrl'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  isRequired
                  label='Feed URL'
                  placeholder='https://example.com/feed.xml'
                  type='url'
                  value={field.value}
                  onValueChange={field.onChange}
                  isDisabled={isSubmitting}
                  className='flex-2'
                />
              )}
            />

            <Controller
              name='enabled'
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  isDisabled={isSubmitting}
                >
                  啟用
                </Switch>
              )}
            />

            <div className='flex gap-2'>
              <Button
                size='sm'
                type='submit'
                color='primary'
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                儲存
              </Button>
              <Button
                size='sm'
                type='button'
                variant='flat'
                onPress={() => reset()}
                isDisabled={isSubmitting}
              >
                重設
              </Button>
            </div>
          </div>

          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === 'success'
                  ? 'bg-success-50 text-success-900'
                  : 'bg-danger-50 text-danger-900'
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  )
}
