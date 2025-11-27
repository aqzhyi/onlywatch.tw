'use client'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import { Switch } from '@heroui/switch'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { insertRssFeed } from '~/features/tg-channels/server-actions/insertRssFeed'

type FormValues = {
  feedUrl: string
  title: string
  enabled: boolean
}

/**
 * Form component for creating a new RSS feed
 *
 * Allows input of feed_url, title, and enabled status. Shows success/error
 * messages after submission and resets form on success.
 *
 * @example
 *   ;<RssFeedCreateForm />
 */
export function RssFeedCreateForm() {
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
      feedUrl: '',
      title: '',
      enabled: true,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setMessage(null)

    const { data: insertedData, error } = await insertRssFeed({
      feed_url: encodeURI(data.feedUrl),
      title: data.title,
      enabled: data.enabled,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Create failed' })
      return
    }

    setMessage({ type: 'success', text: 'Feed created successfully' })
    reset()
    router.refresh()
  }

  return (
    <Card
      className={twMerge(
        'w-full',
        'hover:dark:border hover:dark:border-green-700',
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
                color='success'
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                新增
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
