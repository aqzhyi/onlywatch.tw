import { twMerge } from 'tailwind-merge'

export function WeekdayTitle(props: { value: number; className?: string }) {
  const titles = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']

  return (
    <div
      className={twMerge([
        'text-center text-xl font-bold',
        'hidden md:block',
        props.className,
      ])}
    >
      {titles[props.value]}
    </div>
  )
}
