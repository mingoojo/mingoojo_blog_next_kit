import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from './Button'

export interface ButtonProps
  // 기본 HTML button 속성 전부 상속 (onClick, type, disabled 등)
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    // cva로 정의한 variant/size 타입 자동 추출
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}
