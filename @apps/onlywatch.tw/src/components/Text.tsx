'use client'

import { cva, type VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

const styleCva = cva({
  base: ['inline-block items-center justify-center'],
  variants: {
    variant: {
      default: '',
      h2: 'text-x2 font-bold',
      helper: 'text-default-500 text-sm',
      link: [
        'text-blue-600 hover:underline dark:text-yellow-400',
        'cursor-pointer',
      ],
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export type ButtonProps = Omit<React.ComponentPropsWithRef<'div'>, 'disabled'> &
  VariantProps<typeof styleCva>

export function Text({ variant, size, className, ...props }: ButtonProps) {
  return (
    <div
      {...props}
      className={twMerge(styleCva({ variant, size, className }))}
    >
      {props.children}
    </div>
  )
}
