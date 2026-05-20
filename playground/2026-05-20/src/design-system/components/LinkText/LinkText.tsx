import clsx from 'clsx'
import { LinkTextProps } from './LinkText.types'

const variantClasses = {
  link1: 'text-base ',
  link2: 'text-sm ',
  link3: 'text-sm leading-5 tracking-[-0.15px] text-text-subtle hover:text-text-inverse',
}

const defaultColorClasses = {
  link1: 'text-primary hover:text-primary-hover',
  link2: 'text-primary hover:text-primary-hover',
  link3: '',
}

const defaultFontClasses = {
  head: 'font-bold tracking-tight leading-tight',
  body: 'font-medium leading-normal',
  caption: 'font-normal leading-5 tracking-[-0.15px]',
}

export function LinkText({
  variant = 'link1',
  font = 'body',
  external = false,
  underline = false,
  className,
  children,
  ...props
}: LinkTextProps) {
  return (
    <a
      className={clsx(
        'cursor-pointer transition-colors duration-150',
        underline ? 'underline underline-offset-2' : 'no-underline',
        variantClasses[variant],
        defaultColorClasses[variant],
        defaultFontClasses[font],
        className,
      )}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}>
      {children}
    </a>
  )
}
