import clsx from 'clsx'
import type { CheckboxProps } from './Checkbox.types'

export function Checkbox({
  label,
  errorMessage,
  helperText,
  disabled,
  id,
  className,
  ...props
}: CheckboxProps) {
  const isError = Boolean(errorMessage)
  // label이 string일 때만 자동 id 생성, ReactNode면 id prop 직접 넘겨야 함
  const inputId =
    id ?? (typeof label === 'string' ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label
        htmlFor={inputId}
        className={clsx(
          'flex items-center gap-2 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
        )}>
        <input
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={isError}
          className={clsx(
            'w-4 h-4 rounded border cursor-pointer shrink-0',
            'accent-primary',
            isError ? 'border-error' : 'border-border',
            disabled && 'cursor-not-allowed',
          )}
          {...props}
        />
        {label && (
          <span className={clsx('text-sm', disabled ? 'text-text-disabled' : 'text-text-primary')}>
            {label}
          </span>
        )}
      </label>

      {errorMessage && <p className="text-xs text-error pl-6">{errorMessage}</p>}
      {!errorMessage && helperText && (
        <p className="text-xs text-text-secondary pl-6">{helperText}</p>
      )}
    </div>
  )
}
