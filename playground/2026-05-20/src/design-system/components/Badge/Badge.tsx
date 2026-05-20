import clsx from 'clsx'
import type { BadgeProps } from './Badge.types'

const variantClasses = {
  default: 'bg-bg-muted text-text-secondary',
  success: 'bg-success-light text-success',
  error: 'bg-error-light text-error',
  warning: 'bg-warning-light text-warning',
  info: 'bg-primary-light text-primary',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
}

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}>
      {children}
    </span>
  )
}
