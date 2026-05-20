import clsx from 'clsx'
import type { TextProps, TextVariant, TextAs } from './Text.types'

// variant별 타이포그래피 스타일
const variantClasses: Record<TextVariant, string> = {
  // 24px, 700, line-height 32px, letter-spacing 0.07px
  heading1: 'text-2xl font-bold leading-8 tracking-[0.07px]',
  // 18px, 600, line-height 28px, letter-spacing -0.44px (컬러 배경용)
  heading2: 'text-lg font-semibold leading-7 tracking-[-0.44px]',
  heading3: 'text-xl font-semibold leading-snug',
  body1: 'text-base font-normal leading-relaxed',
  body2: 'text-sm font-normal leading-relaxed',
  caption: 'text-xs font-normal leading-normal',
  label: 'text-sm font-medium leading-none',
}

// variant별 기본 색상
const defaultColorClasses: Record<TextVariant, string> = {
  heading1: 'text-text-primary',
  heading2: 'text-text-inverse', // 컬러 배경용이라 기본이 흰색
  heading3: 'text-text-primary',
  body1: 'text-text-primary',
  body2: 'text-text-secondary',
  caption: 'text-text-disabled',
  label: 'text-text-primary',
}

// color prop으로 색상 오버라이드
const colorClasses = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  disabled: 'text-text-disabled',
  inverse: 'text-text-inverse',
  subtle: 'text-text-subtle',
  error: 'text-error',
  success: 'text-success',
}

// variant별 기본 HTML 태그
const defaultTagMap: Record<TextVariant, TextAs> = {
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  label: 'span',
}

export function Text({ variant = 'body1', color, as, className, children, ...props }: TextProps) {
  const Tag = as ?? defaultTagMap[variant]

  return (
    <Tag
      className={clsx(
        variantClasses[variant],
        color ? colorClasses[color] : defaultColorClasses[variant],
        className,
      )}
      {...props}>
      {children}
    </Tag>
  )
}
