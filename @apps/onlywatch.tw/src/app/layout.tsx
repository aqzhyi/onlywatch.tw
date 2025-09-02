import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import './globals.css'

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
  title: 'error in react digest = 2227452506 and 1572604020',
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
      <body className={`${fontClassNames}`}>{children}</body>
    </html>
  )
}
