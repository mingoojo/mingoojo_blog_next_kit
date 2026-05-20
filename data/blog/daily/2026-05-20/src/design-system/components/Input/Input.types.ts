import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string // 인풋 위 라벨
  helperText?: string // 인풋 아래 안내 문구
  errorMessage?: string // 에러 메시지 (있으면 에러 스타일 자동 적용)
  leftIcon?: ReactNode // 왼쪽 아이콘
  rightIcon?: ReactNode // 오른쪽 아이콘 (비밀번호 토글 등)
  inputSize?: 'sm' | 'md' | 'lg' // size는 HTML 기본 속성과 충돌해서 inputSize로
}
