import { Suspense } from 'react'

export default function Layout(props: LayoutProps<'/'>) {
  return (
    <div className='p-2'>
      <Suspense fallback={'loading...'}>{props.children}</Suspense>
    </div>
  )
}
