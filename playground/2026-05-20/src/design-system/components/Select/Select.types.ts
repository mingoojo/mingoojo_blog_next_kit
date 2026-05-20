import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[]
  label?: string
  placeholder?: string // 기본 선택 안 된 상태 텍스트
  helperText?: string
  errorMessage?: string
  inputSize?: 'sm' | 'md' | 'lg'
}
