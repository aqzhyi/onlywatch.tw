import { Link } from '~/features/i18n/navigation'

export default function AuthCodeError() {
  return (
    <div className='flex min-h-dvh items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800'>
        <div className='mb-4 text-2xl font-bold text-red-600'>登入錯誤</div>
        <div className='mb-6 text-gray-600 dark:text-gray-300'>
          登入過程中發生錯誤，請稍後再試或聯絡客服。
        </div>
        <Link
          href='/sign-in'
          className='inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
        >
          重新登入
        </Link>
      </div>
    </div>
  )
}
