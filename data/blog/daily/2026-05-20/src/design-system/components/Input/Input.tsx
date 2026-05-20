import clsx from 'clsx'
import type { InputProps } from './Input.types'

// 크기별 클래스
const sizeClasses = {
  sm: 'h-8 text-sm px-3',
  md: 'h-10 text-base px-3',
  lg: 'h-12 text-lg px-4',
}

// 아이콘 있을 때 패딩 조정 (아이콘이 텍스트 가리지 않도록)
const leftPaddingClasses = {
  sm: 'pl-8',
  md: 'pl-9',
  lg: 'pl-10',
}

const rightPaddingClasses = {
  sm: 'pr-8',
  md: 'pr-9',
  lg: 'pr-10',
}

export function Input({
  label,
  helperText,
  errorMessage,
  leftIcon,
  rightIcon,
  inputSize = 'md',
  id,
  className,
  disabled,
  ...props
}: InputProps) {
  // errorMessage가 있으면 에러 상태
  const isError = Boolean(errorMessage)

  // label과 input 연결용 id — 외부에서 id 안 넘기면 label 텍스트로 자동 생성
  const inputId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    // 전체 래퍼 — label, input, 안내문구를 세로로 묶음
    <div className="flex flex-col gap-1 w-full">
      {/* 라벨 — label prop 있을 때만 렌더링 */}
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'text-sm font-medium',
            disabled ? 'text-text-disabled' : 'text-text-primary',
          )}>
          {label}
        </label>
      )}

      {/* 인풋 래퍼 — 아이콘 포지셔닝을 위해 relative */}
      <div className="relative flex items-center">
        {/* 왼쪽 아이콘 */}
        {leftIcon && (
          <span className="absolute left-3 flex items-center text-text-disabled pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={isError}
          aria-describedby={
            errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={clsx(
            // 기본 스타일
            'w-full rounded-md border outline-none transition-colors duration-150',
            'bg-bg-base text-text-primary placeholder:text-text-disabled',

            // 크기
            sizeClasses[inputSize],

            // 아이콘 패딩 조정
            leftIcon && leftPaddingClasses[inputSize],
            rightIcon && rightPaddingClasses[inputSize],

            // 상태별 테두리 / 포커스 링
            isError
              ? 'border-error focus:ring-2 focus:ring-error'
              : 'border-border focus:ring-2 focus:ring-border-focus',

            // 비활성 상태
            disabled && 'bg-bg-muted text-text-disabled cursor-not-allowed',

            className,
          )}
          {...props}
        />

        {/* 오른쪽 아이콘 */}
        {rightIcon && (
          <span className="absolute right-3 flex items-center text-text-disabled">{rightIcon}</span>
        )}
      </div>

      {/* 에러 메시지 — errorMessage 우선, 없으면 helperText */}
      {errorMessage && (
        <p id={`${inputId}-error`} className="text-xs text-error">
          {errorMessage}
        </p>
      )}
      {!errorMessage && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  )
}
