import Link from 'next/link'
import { Button } from '~/components/Button'

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-4xl font-bold'>找不到頁面</h1>
      <p>您所尋找的頁面不存在</p>
      <Link href='/'>
        <Button>返回首頁</Button>
      </Link>
    </div>
  )
}
