'use client'

import { ThemeProvider } from 'next-themes'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      forcedTheme="light" // 이거 추가
      attribute="class"
      defaultTheme="light"
      enableSystem={false} // 시스템 설정 무시
    >
      {children}
    </ThemeProvider>
  )
}
