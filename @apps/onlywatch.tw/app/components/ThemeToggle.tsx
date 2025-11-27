'use client'

import { Button } from '@heroui/button'
import { Skeleton } from '@heroui/skeleton'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * @see https://www.heroui.com/docs/customization/dark-mode#add-the-theme-switcher
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toLightIcon = <span className='icon-[mdi--white-balance-sunny]' />
  const toDarkIcon = <span className='icon-[mdi--moon-and-stars]' />

  return (
    <Skeleton
      className='h-10 w-10'
      isLoaded={mounted}
    >
      <Button
        isIconOnly
        variant='bordered'
        onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {!mounted && false}
        {mounted && theme === 'dark' && toLightIcon}
        {mounted && theme === 'light' && toDarkIcon}
      </Button>
    </Skeleton>
  )
}
