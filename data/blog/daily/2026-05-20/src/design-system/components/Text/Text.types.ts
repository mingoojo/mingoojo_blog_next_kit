import type { HTMLAttributes } from 'react'

export type TextVariant =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'label'

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'inverse'
  | 'subtle' // 추가 — 어두운 배경 위 보조 텍스트
  | 'error'
  | 'success'

export type TextAs = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'label'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant
  color?: TextColor
  as?: TextAs
}
