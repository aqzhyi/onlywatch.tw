'use client'

import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Tooltip } from '@heroui/tooltip'
import { Text } from '~/components/Text'
import type { Tables } from '~/db/database.types'
import { Link } from '~/features/i18n/navigation'
import { TelegramIcon } from '~/icons/TelegramIcon'

type ObserverCardProps = {
  value: Tables<'tg_observers'>
}

export function ObserverCard(props: ObserverCardProps) {
  const { value: observer } = props

  const tMeUserName = observer.tg_username

  return (
    <Card className='hover:border-primary h-full transition-colors'>
      <CardHeader className='flex flex-row gap-2'>
        <Tooltip content='瀏覽已推播內容'>
          <Link href={`/my/channels/${tMeUserName}`}>
            <Text className='text-2xl font-bold'>{observer.tg_username}</Text>
          </Link>
        </Tooltip>

        <Tooltip content='在 Telegram App 打開'>
          <Text variant='link'>
            <a
              href={`https://t.me/${tMeUserName.replace('@', '')}`}
              target='_blank'
              rel='noreferrer noopener'
            >
              <TelegramIcon />
            </a>
          </Text>
        </Tooltip>
      </CardHeader>

      <CardBody>
        <Text
          variant='helper'
          size='sm'
        >
          {observer.memo}
        </Text>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  )
}
