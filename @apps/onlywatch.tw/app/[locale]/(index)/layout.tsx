import { Hero } from './components/Hero'

export default function AuthLayout({ children }: LayoutProps<'/[locale]'>) {
  return (
    <div className='flex min-h-dvh flex-col lg:flex-row'>
      {/* 形像展示區塊 - 手機版頂部，電腦版左側 */}
      <div className='flex justify-center bg-linear-to-br from-slate-500 via-gray-800 to-slate-900 p-12 lg:w-1/2 lg:items-center lg:justify-center'>
        <Hero />
      </div>

      {/* 內容區塊 */}
      <div className='flex w-full flex-1 items-start justify-center bg-gray-50 px-6 py-8 lg:w-1/2 lg:items-center lg:bg-white lg:py-12 xl:w-1/3 dark:bg-gray-900 lg:dark:bg-gray-900'>
        <div className='w-full max-w-md space-y-8 text-center'>{children}</div>
      </div>
    </div>
  )
}
