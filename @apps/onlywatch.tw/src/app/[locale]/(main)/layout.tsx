import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuItem,
} from '@heroui/navbar'
import { Skeleton } from '@heroui/skeleton'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { LocaleDropdownButton } from '~/components/LocaleDropdownButton'
import { ThemeToggle } from '~/components/ThemeToggle'
import { auth } from '~/features/better-auth/auth'
import { FilterSetupButton } from '~/features/jin10/components/FilterSetupButton'
import { UserAuthActionsDropdown } from '~/features/better-auth/components/UserAuthActionsDropdown'
import { UserAvatar } from '~/features/better-auth/components/UserAvatar'

export default async function Layout({
  params,
  children,
}: LayoutProps<'/[locale]'>) {
  const userSession = await auth.api.getSession({ headers: await headers() })

  return (
    <div className='grid h-dvh grid-rows-[3rem_1fr]'>
      {/* Header area */}
      <Navbar
        maxWidth='full'
        height='3rem'
        isBordered
        classNames={{
          wrapper: 'px-2',
        }}
      >
        <NavbarBrand>
          <Link
            href='/'
            className='flex flex-row items-center gap-2'
          >
            <Image
              alt='site logo'
              src='/favicon.png'
              width={32}
              height={32}
            />
            <div className='hidden md:block'>onlywatch.tw</div>
          </Link>
        </NavbarBrand>

        <NavbarContent
          justify='end'
          className='gap-2'
        >
          <NavbarMenuItem>
            <LocaleDropdownButton />
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Suspense fallback={<Skeleton />}>
              <FilterSetupButton />
            </Suspense>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <UserAuthActionsDropdown hasUser={Boolean(userSession?.user)}>
              <UserAvatar avatarUrl={userSession?.user.image || ''} />
            </UserAuthActionsDropdown>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <ThemeToggle />
          </NavbarMenuItem>
        </NavbarContent>

        {/* TODO */}
        {/* <NavbarContent className='md:hidden'>
          <span className='icon-[mdi--menu]' />
        </NavbarContent> */}

        {/* TODO */}
        {/* <NavbarMenu>
          <NavbarMenuItem>行事曆</NavbarMenuItem>
          <NavbarMenuItem>登出</NavbarMenuItem>
          <NavbarMenuItem>登入</NavbarMenuItem>
        </NavbarMenu> */}
      </Navbar>

      {/* Main area */}
      <main className='p-2'>
        <Suspense
          fallback={<Skeleton className={twMerge('h-full', 'rounded-md')} />}
        >
          {children}
        </Suspense>
      </main>
    </div>
  )
}
