'use client'

import to from 'await-to-js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/Button'
import { authClient } from '~/features/better-auth/authClient'
import { LineIcon } from '~/icons/LineIcon'

export default function SignInPage() {
  const router = useRouter()

  return (
    <div className='flex min-h-dvh flex-col lg:flex-row'>
      {/* 形像展示區塊 - 手機版頂部，電腦版左側 */}
      <div className='flex justify-center bg-gradient-to-br from-slate-500 via-gray-800 to-slate-900 p-12 lg:w-1/2 lg:items-center lg:justify-center'>
        <Hero />
      </div>

      {/* 登入區塊 */}
      <div className='flex w-full flex-1 items-start justify-center bg-gray-50 px-6 py-8 lg:w-1/2 lg:items-center lg:bg-white lg:py-12 xl:w-1/3 dark:bg-gray-900 lg:dark:bg-gray-900'>
        <div className='w-full max-w-md space-y-8 text-center'>
          <div className='space-y-3'>
            <div className='text-3xl font-bold text-gray-900 dark:text-white'>
              登入
            </div>
            <div className='text-base text-gray-600 dark:text-gray-300'>
              登入之後可以客製化的瀏覽體驗
            </div>
          </div>

          {/* Google 登入按鈕 */}
          <form
            onSubmit={async (event) => {
              event.preventDefault()

              const [error, response] = await to(
                authClient.signIn.social({
                  provider: 'line',
                  requestSignUp: false,
                }),
              )

              if (response?.data?.url) {
                router.push(response.data.url)
              }

              if (error) {
                router.push('/auth/error')
              }
            }}
          >
            <Button
              type='submit'
              aria-label='使用 Google 登入'
              className='w-full space-x-2'
            >
              <LineIcon />
              <span>LINE 登入</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className='w-full max-w-xs lg:max-w-md'>
      <div className='space-y-2 rounded-2xl bg-white p-6 text-center shadow-xl lg:shadow-2xl'>
        <div className='inline-block rounded-lg bg-slate-700 px-4 py-2'>
          <div className='text-lg font-bold text-white lg:text-xl'>
            onlywatch.tw
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-xl font-bold text-gray-800 lg:text-2xl'>
            經濟數據行日曆
          </div>
          <div className='text-sm text-gray-600 lg:text-base'>
            <div>美國、歐盟</div>
            <div>日本、瑞士、加拿大、澳洲、紐西蘭</div>
          </div>
        </div>
        <div className='flex flex-col items-center space-y-2'>
          <Image
            alt='site logo'
            src='/favicon.png'
            width={64}
            height={64}
          />
          <div className='text-xs text-gray-500 lg:text-gray-400'>
            <div>大非農、就業人數</div>
            <div>CPI、PCE、PMI、GDP、利率決議...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
