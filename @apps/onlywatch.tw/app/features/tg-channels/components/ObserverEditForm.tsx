'use client'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import type { Tables } from '~/db/database.types'
import { Link } from '~/features/i18n/navigation'
import { updateObserver } from '~/features/tg-channels/server-actions/updateObserver'

type ObserverEditFormProps = {
  observer: Tables<'tg_observers'>
}

type FormValues = {
  id: number
  tgId: string
  tgUsername: string
  memo: string
}

/**
 * Form component for editing Telegram observer details
 *
 * Allows editing of tg_id, tg_username, and memo. Shows success/error messages
 * after submission.
 *
 * @example
 *   ;<ObserverEditForm observer={observerData} />
 *
 * @param props - Component props containing the observer data
 */
export function ObserverEditForm({ observer }: ObserverEditFormProps) {
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
      id: observer.id,
      tgId: observer.tg_id.toString(),
      tgUsername: observer.tg_username,
      memo: observer.memo || '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setMessage(null)

    const tgIdNumber = Number.parseInt(data.tgId, 10)
    if (Number.isNaN(tgIdNumber)) {
      setMessage({ type: 'error', text: 'Telegram ID must be a number' })
      return
    }

    const { data: updatedData, error } = await updateObserver({
      id: data.id,
      tg_id: tgIdNumber,
      tg_username: data.tgUsername,
      memo: data.memo || null,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Update failed' })
      return
    }

    setMessage({ type: 'success', text: 'Observer updated successfully' })
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
              name='tgUsername'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  isRequired
                  label='Telegram 使用者名稱'
                  placeholder='@example_channel'
                  value={field.value}
                  onValueChange={field.onChange}
                  isDisabled={isSubmitting}
                  className='flex-1'
                />
              )}
            />

            <Controller
              name='tgId'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  isRequired
                  label='Telegram ID'
                  placeholder='123456789'
                  type='text'
                  value={field.value}
                  onValueChange={field.onChange}
                  isDisabled={isSubmitting}
                  className='flex-1'
                />
              )}
            />

            <Controller
              name='memo'
              control={control}
              render={({ field }) => (
                <Input
                  label='備註'
                  placeholder='備註說明'
                  value={field.value}
                  onValueChange={field.onChange}
                  isDisabled={isSubmitting}
                  className='flex-2'
                />
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
              <Link href={`/my/observers/${observer.id}`}>
                <Button
                  size='sm'
                  type='button'
                  variant='flat'
                  color='warning'
                  isDisabled={isSubmitting}
                >
                  管理訂閱來源
                </Button>
              </Link>
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
