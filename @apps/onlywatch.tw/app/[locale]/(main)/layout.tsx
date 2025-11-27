import { Button } from '@heroui/button'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuItem,
} from '@heroui/navbar'
import { Skeleton } from '@heroui/skeleton'
import { Tooltip } from '@heroui/tooltip'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { ThemeToggle } from '~/components/ThemeToggle'
import { auth } from '~/features/better-auth/auth'
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
            <Tooltip content='瀏覽公開頻道'>
              <Link href='/channels'>
                <Button
                  isIconOnly
                  variant='bordered'
                >
                  <span className='icon-[mdi--telegram] h-6 w-6 text-cyan-400' />
                </Button>
              </Link>
            </Tooltip>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <UserAuthActionsDropdown hasUser={Boolean(userSession?.user)}>
              <UserAvatar avatarUrl={userSession?.user.image || ''} />
            </UserAuthActionsDropdown>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Tooltip content='管理我的頻道'>
              <Link href='/my'>
                <Button
                  isIconOnly
                  variant='bordered'
                >
                  <span className='icon-[mdi--gear] h-6 w-6' />
                </Button>
              </Link>
            </Tooltip>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <ThemeToggle />
          </NavbarMenuItem>
        </NavbarContent>
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
