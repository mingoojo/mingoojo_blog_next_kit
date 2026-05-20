import clsx from 'clsx'
import type { SelectProps } from './Select.types'

const sizeClasses = {
  sm: 'h-8 text-sm px-3',
  md: 'h-10 text-base px-3',
  lg: 'h-12 text-lg px-4',
}

export function Select({
  options,
  label,
  placeholder,
  helperText,
  errorMessage,
  inputSize = 'md',
  disabled,
  id,
  className,
  ...props
}: SelectProps) {
  const isError = Boolean(errorMessage)
  const selectId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className={clsx(
            'text-sm font-medium',
            disabled ? 'text-text-disabled' : 'text-text-primary',
          )}>
          {label}
        </label>
      )}

      {/* 화살표 아이콘을 위해 relative 래퍼 */}
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={isError}
          className={clsx(
            'w-full rounded-md border outline-none transition-colors duration-150 appearance-none',
            'bg-bg-base text-text-primary',
            'pr-8', // 오른쪽 화살표 아이콘 공간
            sizeClasses[inputSize],
            isError
              ? 'border-error focus:ring-2 focus:ring-error'
              : 'border-border focus:ring-2 focus:ring-border-focus',
            disabled && 'bg-bg-muted text-text-disabled cursor-not-allowed',
            className,
          )}
          {...props}>
          {/* placeholder 옵션 */}
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 드롭다운 화살표 아이콘 */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-disabled">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {errorMessage && <p className="text-xs text-error">{errorMessage}</p>}
      {!errorMessage && helperText && <p className="text-xs text-text-secondary">{helperText}</p>}
    </div>
  )
}
