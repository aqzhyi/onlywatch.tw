'use client'

import { Button, type ButtonProps } from '@heroui/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { useLocale } from 'next-intl'
import { useRouter } from '~/features/i18n/navigation'
import { setLocaleToJapanese } from '~/features/i18n/server-actions/setLocaleToJapanese'
import { setLocaleToTaiwan } from '~/features/i18n/server-actions/setLocaleToTaiwan'

export function LocaleDropdownButton({ ...buttonProps }: ButtonProps) {
  const locale = useLocale()
  const router = useRouter()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant='bordered'
          {...buttonProps}
        >
          <div className='icon-[mdi--spoken-language]'></div>
        </Button>
      </DropdownTrigger>

      <DropdownMenu aria-label='set up the language'>
        <DropdownItem
          key='日本語'
          aria-label='Set language to Japanese'
          classNames={{
            title: 'flex flex-row items-center gap-2',
          }}
          onPress={() => {
            setLocaleToJapanese()
            router.refresh()
          }}
        >
          {locale === 'ja' && <span className='icon-[mdi--check-bold]' />}
          {locale !== 'ja' && <span className='icon-[mdi--spoken-language]' />}
          <span>日本語 (ja)</span>
        </DropdownItem>

        <DropdownItem
          key='正體中文'
          aria-label='Set language to Traditional Chinese'
          classNames={{
            title: 'flex flex-row items-center gap-2',
          }}
          onPress={() => {
            setLocaleToTaiwan()
            router.refresh()
          }}
        >
          {locale === 'zh-tw' && <span className='icon-[mdi--check-bold]' />}
          {locale !== 'zh-tw' && (
            <span className='icon-[mdi--spoken-language]' />
          )}
          <span>正體中文 (zh-tw)</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
