import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CardProps } from './Card.types'

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const variantClasses = {
  panel: 'rounded-[10px] border border-border shadow-md bg-white',
  form: 'rounded-2xl shadow-xl bg-white',
}

export function Card({
  variant,
  padding = 'md',
  bordered = true,
  shadow = true,
  className,
  children,
  ...props
}: CardProps) {
  if (variant) {
    return (
      <div
        className={twMerge(
          variantClasses[variant],
          paddingClasses[padding], // padding 항상 적용
          className,
        )}
        {...props}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'bg-bg-base rounded-lg',
        paddingClasses[padding],
        bordered && 'border border-border',
        shadow && 'shadow-sm',
        className,
      )}
      {...props}>
      {children}
    </div>
  )
}
