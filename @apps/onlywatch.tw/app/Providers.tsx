'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers(props: React.PropsWithChildren) {
  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute='class'
        defaultTheme='dark'
      >
        {props.children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
