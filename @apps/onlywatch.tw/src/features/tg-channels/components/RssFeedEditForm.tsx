'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Switch } from '@heroui/switch'
import to from 'await-to-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { Tables } from '~/db/database.types'
import { updateRssFeed } from '~/features/tg-channels/server-actions/updateRssFeed'

type RssFeedEditFormProps = {
  feed: Tables<'tg_rss_feeds'>
}

type FormValues = {
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
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      feedUrl: decodeURI(feed.feed_url),
      title: feed.title,
      enabled: feed.enabled,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setMessage(null)

    const { data: updatedData, error } = await updateRssFeed({
      id: feed.id,
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
    <Card className='w-full max-w-2xl'>
      <CardHeader className='flex-col items-start gap-2'>
        <h1 className='text-2xl font-bold'>修改新聞源</h1>
        <p className='text-default-500 text-sm'>
          ID: {feed.id} | 建立於: {new Date(feed.created_at).toLocaleString()}
        </p>
      </CardHeader>
      <CardBody>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
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
                啟用此 RSS 新聞源
              </Switch>
            )}
          />

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

          <div className='flex gap-2'>
            <Button
              type='submit'
              color='primary'
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              儲存
            </Button>
            <Button
              type='button'
              variant='flat'
              onPress={() => router.back()}
              isDisabled={isSubmitting}
            >
              取消
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
