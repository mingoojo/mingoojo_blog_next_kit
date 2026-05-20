import { Link } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: 'RINEX 다운로드', to: '/rinex' },
  { label: '마이페이지', to: '/mypage' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* 백드롭 */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />}

      {/* 사이드바 드로어 */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl
          transform transition-transform duration-300 md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
        {/* 헤더 */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          <img src="/images/PPS_CI_BLUE.png" className="w-16" alt="pps_logo" />
          <button onClick={onClose} className="p-2 rounded-md hover:bg-bg-subtle">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="px-4 py-3 rounded-lg text-sm text-text-primary hover:bg-bg-subtle transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
