import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { ThemeToggle } from '~/components/ThemeToggle'

export default function Template(props: React.PropsWithChildren) {
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
          {/* TODO */}
          {/* <NavbarMenuItem>登入</NavbarMenuItem> */}
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
      <div className='p-2'>{props.children}</div>
    </Fragment>
  )
}
