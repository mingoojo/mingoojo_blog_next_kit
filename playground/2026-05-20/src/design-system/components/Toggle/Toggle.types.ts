import type { InputHTMLAttributes } from 'react'

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  helperText?: string
  size?: 'sm' | 'md'
}
