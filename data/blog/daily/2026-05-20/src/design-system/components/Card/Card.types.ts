import type { HTMLAttributes } from 'react'

export type CardVariant = 'panel' | 'form'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  bordered?: boolean
  shadow?: boolean
  className?: string
}
