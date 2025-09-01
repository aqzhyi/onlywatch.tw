import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuItem,
} from '@heroui/navbar'
import { Skeleton } from '@heroui/skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, Suspense } from 'react'
import { ThemeToggle } from '~/components/ThemeToggle'
import { FilterSetupButton } from '~/features/jin10/components/FilterSetupButton'

export default function Layout(props: LayoutProps<'/'>) {
  return (
    <Fragment>
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

        <NavbarContent justify='end'>
          <NavbarMenuItem className='flex flex-row items-center justify-center gap-2'>
            <Suspense fallback={<Skeleton />}>
              <FilterSetupButton />
            </Suspense>

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
      <div className='p-2'>
        <Suspense fallback={<Skeleton />}>{props.children}</Suspense>
      </div>
    </Fragment>
  )
}
