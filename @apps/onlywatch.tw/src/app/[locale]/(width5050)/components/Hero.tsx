import Image from 'next/image'

export function Hero() {
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
            宅男不出門 何知天下事
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
            <div>政治、產業、職籃、職棒、啦啦隊</div>
            <div>以及，金融、外匯、黃金、股市新聞</div>
            <div>ONLY WATCH</div>
          </div>
        </div>
      </div>
    </div>
  )
}
