import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Providers } from '~/app/Providers'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { envPublicVars } from '~/envPublicVars'
import { Suspense } from 'react'
import { Skeleton } from '@heroui/skeleton'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'

const t = await getTranslations()

const fontSans = Noto_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})

const fontMono = Noto_Sans_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

const fontClassNames = `${fontSans.variable} ${fontMono.variable} antialiased`

export const metadata: Metadata = {
  title: t('site.name'),
  description: t('site.document.description'),
  keywords: t('site.document.keywords'),
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='zh-TW'
      className='dark'
      suppressHydrationWarning
    >
      <GoogleAnalytics gaId={`G-${envPublicVars.NEXT_PUBLIC_GA_ID}`} />
      <body className={`${fontClassNames}`}>
        <NuqsAdapter>
          <NextIntlClientProvider>
            <Providers>
              <Suspense fallback={<Skeleton className='h-dvh rounded-md' />}>
                {children}
              </Suspense>
            </Providers>
          </NextIntlClientProvider>
        </NuqsAdapter>
        <SpeedInsights />
      </body>
    </html>
  )
}
