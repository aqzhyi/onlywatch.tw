import { Skeleton } from '@heroui/skeleton'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { Suspense } from 'react'
import { Providers } from '~/app/Providers'
import { envPublicVars } from '~/envPublicVars'
import '../globals.css'
import { routing } from '~/features/i18n/routing'
import { notFound } from 'next/navigation'

const fontSans = Noto_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})

const fontMono = Noto_Sans_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

const fontClassNames = `${fontSans.variable} ${fontMono.variable} antialiased`

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const $t = await getTranslations({ locale })

  return {
    title: $t('site.name'),
    description: $t('site.document.description'),
    keywords: $t('site.document.keywords'),
    icons: {
      icon: '/favicon.png',
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  params,
  children,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className='dark'
      suppressHydrationWarning
    >
      <GoogleAnalytics gaId={`G-${envPublicVars.NEXT_PUBLIC_GA_ID}`} />
      <body className={`${fontClassNames}`}>
        <NuqsAdapter>
          <Providers>
            <Suspense fallback={<Skeleton className='h-dvh rounded-md' />}>
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </Suspense>
          </Providers>
        </NuqsAdapter>
        <SpeedInsights />
      </body>
    </html>
  )
}
