'use client'

import { Button } from '@heroui/button'
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

  if (!mounted) return null

  const toLightIcon = <span className='icon-[mdi--white-balance-sunny]' />
  const toDarkIcon = <span className='icon-[mdi--moon-and-stars]' />

  return (
    <Button
      isIconOnly
      variant='bordered'
      onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' && toLightIcon}
      {theme === 'light' && toDarkIcon}
    </Button>
  )
}
