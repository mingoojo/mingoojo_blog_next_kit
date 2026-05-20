export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  label?: string // 그룹 상단 라벨 ("지도 레이어" 같은)
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}
