import clsx from 'clsx'
import type { DividerProps } from './Divider.types'

export function Divider({ label, direction = 'horizontal', className, ...props }: DividerProps) {
  if (direction === 'vertical') {
    return <div className={clsx('w-px self-stretch bg-border', className)} {...props} />
  }

  // 라벨 있으면 양쪽에 선 + 가운데 텍스트
  if (label) {
    return (
      <div className={clsx('flex items-center gap-3', className)} {...props}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-text-disabled shrink-0">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    )
  }

  return <div className={clsx('h-px w-full bg-border', className)} {...props} />
}
