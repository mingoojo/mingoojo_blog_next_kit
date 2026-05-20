import type { HTMLAttributes } from 'react'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string // 가운데 텍스트 (예: "또는")
  direction?: 'horizontal' | 'vertical'
}
