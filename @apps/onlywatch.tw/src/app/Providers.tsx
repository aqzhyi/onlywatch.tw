'use client'

import { HeroUIProvider } from '@heroui/react'

export function Providers(props: React.PropsWithChildren) {
  return <HeroUIProvider>{props.children}</HeroUIProvider>
}
