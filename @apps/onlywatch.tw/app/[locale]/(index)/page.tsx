import { Fragment } from 'react/jsx-runtime'
import { Button } from '~/components/Button'
import { Link } from '~/features/i18n/navigation'

export default async function SignInPage() {
  return (
    <Fragment>
      <Link
        className='block'
        href={'/channels'}
      >
        <Button
          type='button'
          aria-label='瀏覽可用的 Telegram 現有頻道'
          className='w-full space-x-2'
        >
          <span className='icon-[mdi--telegram] text-blue-500'></span>
          <span>瀏覽可用的 Telegram 現有頻道</span>
        </Button>
      </Link>

      <Button
        type='button'
        aria-label='五分鐘建好 Telegram 自動頻道'
        className='w-full space-x-2'
        disabled
      >
        <span className='icon-[mdi--telegram] text-blue-500'></span>
        <span className='line-through'>五分鐘建好 Telegram 自動頻道</span>
      </Button>

      <Link
        className='block'
        href={'/my'}
      >
        <Button
          type='button'
          aria-label='管理自己的 Telegram 自動頻道'
          className='w-full space-x-2'
        >
          <span className='icon-[mdi--telegram] text-blue-500'></span>
          <span>管理自己的 Telegram 自動頻道</span>
        </Button>
      </Link>
    </Fragment>
  )
}
