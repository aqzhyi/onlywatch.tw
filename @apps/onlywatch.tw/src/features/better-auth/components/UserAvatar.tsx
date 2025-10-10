import { Button, type ButtonProps } from '@heroui/button'
import Image from 'next/image'

type UserAvatarProps = ButtonProps & {
  avatarUrl?: string
}

export function UserAvatar(props: UserAvatarProps) {
  const { avatarUrl, ...restProps } = props

  return (
    <Button
      isIconOnly
      variant='bordered'
      {...restProps}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt='使用者頭像'
          width={24}
          height={24}
          className='h-6 w-6 rounded-full object-cover'
        />
      ) : (
        <span className='icon-[mdi--account-circle] h-6 w-6' />
      )}
    </Button>
  )
}
