import { useUiStore } from '@/store'
import { Toast } from './Toast'

/*
  ToastContainer는 providers.tsx에 한 번만 렌더링.
  ui.store의 toasts 배열을 구독해서 자동으로 렌더링/제거됨.
  fixed + z-50으로 항상 최상단에 위치.
*/
export function ToastContainer() {
  const toasts = useUiStore((state) => state.toasts)

  return (
    <div
      aria-live="polite" // 스크린리더에 동적 알림 영역임을 알림
      className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
