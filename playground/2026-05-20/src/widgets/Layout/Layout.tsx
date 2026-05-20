import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@/widgets/Footer/Footer'
import { Sidebar } from '@/widgets/Sidebar/SideBar'
import Header from '@/widgets/Header/Header'

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
