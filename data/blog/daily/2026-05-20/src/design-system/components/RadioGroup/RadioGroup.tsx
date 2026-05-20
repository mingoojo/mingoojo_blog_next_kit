import clsx from 'clsx'
import type { RadioGroupProps } from './RadioGroup.types'

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  icon,
  disabled,
  className,
}: RadioGroupProps) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {/* 상단 라벨 영역 */}
      {label && (
        <div className="flex items-center gap-2">
          {icon && <span className="text-text-secondary">{icon}</span>}
          <span className="text-base font-semibold text-text-primary">{label}</span>
        </div>
      )}

      {/* 옵션 버튼 그룹 */}
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {options.map((option) => {
          const isSelected = value === option.value
          const isDisabled = disabled || option.disabled

          return (
            <button
              key={option.value}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(option.value)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                isSelected
                  ? 'bg-primary-light text-primary' // 선택됨
                  : 'bg-bg-muted text-text-secondary hover:bg-bg-subtle', // 미선택
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
              )}>
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
