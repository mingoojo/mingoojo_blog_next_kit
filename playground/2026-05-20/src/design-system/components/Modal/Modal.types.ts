import type { ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean // 외부에서 열림/닫힘 제어
  onClose: () => void // 닫기 요청 시 호출 (백드롭 클릭, ESC 키)
  title?: string // 모달 상단 타이틀
  children: ReactNode // 모달 본문
  footer?: ReactNode // 하단 버튼 영역 (선택)
  closeOnBackdrop?: boolean // 백드롭 클릭 시 닫기 여부 (기본 true)
  size?: 'sm' | 'md' | 'lg'
}
