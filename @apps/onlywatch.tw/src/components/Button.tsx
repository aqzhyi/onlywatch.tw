'use client'
import { cva, type VariantProps } from 'cva'

const buttonCva = cva({
  base: [
    'flex items-center justify-center',
    'rounded-lg border',
    'transition-colors',

    'border-gray-300 text-gray-700',
    'hover:bg-gray-50',

    'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200',
    'dark:hover:bg-gray-700',
  ],
  variants: {
    intent: {
      primary: '',
      secondary: '',
    },
    disabled: {
      true: 'cursor-no-drop opacity-50',
      false: 'cursor-pointer',
    },
    size: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    },
  },
  defaultVariants: {
    disabled: false,
    intent: 'primary',
    size: 'md',
  },
})

export type ButtonProps = Omit<
  React.ComponentPropsWithRef<'button'>,
  'disabled'
> &
  VariantProps<typeof buttonCva>

export function Button({
  intent,
  size,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={buttonCva({ intent, size, className, disabled })}
    >
      {props.children}
    </button>
  )
}
