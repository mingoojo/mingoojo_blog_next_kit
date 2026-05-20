import { useEffect } from 'react'
import clsx from 'clsx'
import { useUiStore } from '@/store'
import type { ToastItem } from './Toast.types'

// 타입별 스타일 정의
const toastStyles: Record<ToastItem['type'], string> = {
  success: 'bg-success-light text-success border-success',
  error: 'bg-error-light text-error border-error',
  warning: 'bg-warning-light text-warning border-warning',
  info: 'bg-primary-light text-primary border-primary',
}

// 타입별 아이콘 (SVG)
function ToastIcon({ type }: { type: ToastItem['type'] }) {
  if (type === 'success')
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  if (type === 'error')
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    )
  if (type === 'warning')
    return (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
    )
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
      />
    </svg>
  )
}

export function Toast({ id, type, message, duration = 3000 }: ToastItem) {
  const removeToast = useUiStore((state) => state.removeToast)

  // duration 후 자동 제거
  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration)
    return () => clearTimeout(timer) // 언마운트 시 타이머 정리
  }, [id, duration, removeToast])

  return (
    <div
      role="alert"
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg border',
        'w-80 shadow-md',
        // 슬라이드 인 애니메이션
        'animate-[toast-in_0.2s_ease-out]',
        toastStyles[type],
      )}>
      <ToastIcon type={type} />
      <p className="text-sm flex-1">{message}</p>

      {/* 수동 닫기 버튼 */}
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="알림 닫기">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
