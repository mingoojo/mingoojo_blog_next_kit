import { Button, Divider } from '@/design-system'
import { useAuthStore } from '@/store'
import { Link, useNavigate } from 'react-router-dom'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { isAuthenticated, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="bg-white flex justify-center border-b border-border sticky top-0 z-50">
      <div className="h-14 flex items-center justify-between px-4 top-0 md:w-300 w-full">
        {/* 로고 */}
        <Link to="/" className="flex items-baseline gap-2">
          <img src="/images/PPS_CI_BLUE.png" className="w-16" alt="pps_logo" />
          <span className="text-company font-semibold text-sm">CloudStore</span>
        </Link>

        {/* 우측 버튼 */}
        <div className="flex items-center gap-2">
          {/* 데스크탑 네비 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/rinex"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              RINEX 다운로드
            </Link>
            <Link
              to="/mypage"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              마이페이지
            </Link>
          </nav>

          {isAuthenticated ? (
            <Button variant="primary" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
              로그인
            </Button>
          )}

          {/* 햄버거 — 모바일만 */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md hover:bg-bg-subtle transition-colors cursor-pointer"
            aria-label="메뉴 열기">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
