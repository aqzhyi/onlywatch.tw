import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import { site } from '~/site'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Providers } from '~/app/Providers'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { envPublicVars } from '~/envPublicVars'

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
  title: site.name,
  description:
    '提供投資者用於規畫月度季度之波段交易的經濟數據、與國際事件觀察工具',
  keywords: [
    '大盤',
    '日元',
    '日股',
    '日幣',
    '加息',
    '外匯',
    '央行',
    '行事曆',
    '利率決議',
    '投資',
    '波段交易',
    '金融',
    '非農',
    '美元',
    '美股',
    '美金',
    '美聯儲',
    '降息',
    '原油',
    '國際事件',
    '國際關係',
    '貨幣政策',
    '通貨膨脹',
    '通脹',
    '就業數據',
    '黃金',
    '新台幣',
    '財經日曆',
    '經濟日曆',
    '經濟事件',
    '經濟數據',
    '歐元',
    '澳幣',
    '趨勢',
    'ETF',
    'FOMC',
  ],
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
          <Providers>{children}</Providers>
        </NuqsAdapter>
        <SpeedInsights />
      </body>
    </html>
  )
}
