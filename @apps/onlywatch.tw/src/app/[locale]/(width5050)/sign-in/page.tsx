'use client'

import to from 'await-to-js'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react/jsx-runtime'
import { Button } from '~/components/Button'
import { authClient } from '~/features/better-auth/authClient'
import { LineIcon } from '~/icons/LineIcon'

export default function SignInPage() {
  const router = useRouter()

  return (
    <Fragment>
      <div className='space-y-3'>
        <div className='text-3xl font-bold text-gray-900 dark:text-white'>
          登入
        </div>
        <div className='text-base text-gray-600 dark:text-gray-600'>
          不需要註冊步驟，那太麻煩了，直接登入就好
        </div>
      </div>

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
          aria-label='使用 LINE 登入'
          className='w-full space-x-2'
        >
          <LineIcon />
          <span>LINE 登入</span>
        </Button>
      </form>
    </Fragment>
  )
}
