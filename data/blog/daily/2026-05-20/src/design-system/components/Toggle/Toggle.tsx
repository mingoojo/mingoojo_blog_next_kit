import clsx from 'clsx'
import type { ToggleProps } from './Toggle.types'

export function Toggle({
  label,
  helperText,
  size = 'md',
  disabled,
  id,
  className,
  ...props
}: ToggleProps) {
  const inputId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label
        htmlFor={inputId}
        className={clsx(
          'flex items-center gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
        )}>
        <div className="relative">
          <input
            id={inputId}
            type="checkbox"
            role="switch"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />

          {/* 트랙 */}
          <div
            className={clsx(
              'rounded-full transition-colors duration-200',
              'bg-bg-muted peer-checked:bg-primary',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-border-focus',
              size === 'md' ? 'w-11 h-6' : 'w-8 h-5',
            )}
          />

          {/* thumb — 사이즈별 완성된 문자열로 명시 */}
          <div
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 left-0.5',
              'rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              size === 'md'
                ? 'w-5 h-5 peer-checked:translate-x-5'
                : 'w-3.5 h-3.5 peer-checked:translate-x-3.5',
            )}
          />
        </div>

        {label && (
          <span className={clsx('text-sm', disabled ? 'text-text-disabled' : 'text-text-primary')}>
            {label}
          </span>
        )}
      </label>

      {helperText && <p className="text-xs text-text-secondary">{helperText}</p>}
    </div>
  )
}
