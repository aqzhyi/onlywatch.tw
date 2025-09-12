'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import type { UserResponse } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { signOut } from '~/features/members/server-actions/signOut'

type UserActionsDropdownProps = {
  user: Promise<UserResponse>
} & React.PropsWithChildren

export function UserAuthActionsDropdown({
  children,
  ...props
}: UserActionsDropdownProps) {
  const router = useRouter()
  const { data: user, error: userError } = use(props.user)

  const isSignedIn = !!user && !userError

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
      onPress={() => {
        signOut()
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
