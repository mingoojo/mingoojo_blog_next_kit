'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import { usePathname } from 'next/navigation'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }
  const pathname = usePathname()

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            {/* <Image src="/static/images/logo1.svg" alt="Logo" width={100} height={20} /> */}
            {/* <Logo /> */}
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => {
              const firstSegment = `/${pathname.split('/')[1]}`
              let isActive = firstSegment === link.href

              // Study(/blog)는 글 목록 + 태그 페이지에서 활성
              if (link.href === '/blog') {
                isActive = pathname.startsWith('/blog') || pathname.startsWith('/tags')
              }
              // Work(/work)는 work 경로에서 활성
              if (link.href === '/work') {
                isActive = pathname.startsWith('/work')
              }

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={
                    isActive
                      ? 'm-1 font-medium text-primary-500 dark:text-primary-400'
                      : 'hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100'
                  }>
                  {link.title}
                </Link>
              )
            })}
        </div>
        <SearchButton />
        {/* <ThemeSwitch /> */}
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
