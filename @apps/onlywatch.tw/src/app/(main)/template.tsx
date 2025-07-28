import Image from 'next/image'
import Link from 'next/link'

export default function Template(props: React.PropsWithChildren) {
  return (
    <div className='flex flex-col gap-2'>
      <Menu />
      {props.children}
    </div>
  )
}

function Menu() {
  return (
    <div className='flex h-12 items-center border-b border-gray-200 bg-white px-2 dark:border-gray-700 dark:bg-gray-900'>
      <Link
        href='/'
        className='flex flex-row items-center gap-2'
      >
        <Image
          alt='site logo'
          src='/favicon.png'
          width={32}
          height={32}
        />
        onlywatch.tw
      </Link>
    </div>
  )
}
