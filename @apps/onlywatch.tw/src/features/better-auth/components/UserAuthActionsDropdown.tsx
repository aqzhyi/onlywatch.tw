'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import to from 'await-to-js'
import { useRouter } from 'next/navigation'
import { authClient } from '~/features/better-auth/authClient'

type UserActionsDropdownProps = {
  hasUser: boolean
} & React.PropsWithChildren

export function UserAuthActionsDropdown({
  children,
  hasUser,
  ...props
}: UserActionsDropdownProps) {
  const router = useRouter()

  const isSignedIn = hasUser

  const signInButton = (
    <DropdownItem
      key='signIn'
      classNames={{
        title: 'flex flex-row items-center gap-2',
      }}
      onPress={() => {
        router.push('/sign-in')
      }}
    >
      <span className='icon-[mdi--login]' />
      <span>登入</span>
    </DropdownItem>
  )

  const signOutButton = (
    <DropdownItem
      key='signOut'
      classNames={{
        title: 'flex flex-row items-center gap-2',
      }}
      onPress={async () => {
        const [error, response] = await to(authClient.signOut())

        if (response?.data?.success) {
          router.refresh()
        }
      }}
    >
      <span className='icon-[mdi--logout]' />
      <span>登出</span>
    </DropdownItem>
  )

  return (
    <Dropdown>
      <DropdownTrigger>{children}</DropdownTrigger>

      <DropdownMenu aria-label='使用者選單'>
        {!isSignedIn ? signInButton : null}
        {isSignedIn ? signOutButton : null}
      </DropdownMenu>
    </Dropdown>
  )
}
