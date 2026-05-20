import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import type { ModalProps } from './Modal.types'

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  size = 'md',
}: ModalProps) {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return

    // 모달 열렸을 때 body 스크롤 방지
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      // 모달 닫힐 때 스크롤 복구 + 이벤트 제거
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  // createPortal: 모달을 body 직하위에 렌더링
  // z-index 충돌, 부모 overflow:hidden 문제 방지
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}>
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* 모달 본체 */}
      <div
        className={clsx(
          'relative w-full bg-bg-base rounded-xl shadow-lg',
          'flex flex-col',
          sizeClasses[size],
        )}>
        {/* 헤더 */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 id="modal-title" className="text-lg font-medium text-text-primary">
              {title}
            </h2>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="text-text-disabled hover:text-text-primary transition-colors"
              aria-label="모달 닫기">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* 본문 */}
        <div className="px-6 py-4 flex-1">{children}</div>

        {/* 푸터 (선택) */}
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
