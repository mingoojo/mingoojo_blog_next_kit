'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  const { theme, setTheme, resolvedTheme } = useTheme()
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
              console.log(link)
              console.log(pathname)

              console.log(`${pathname.split("/")[1]}/`, link.href)

              if (link.href === '/blog') {
                if (pathname.startsWith('/tags') || pathname.startsWith('/blog')) {
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      className={"m-1 font-medium text-primary-500 dark:text-primary-400"}>
                      {link.title}
                    </Link>
                  )
                }
              }
              if (link.href === '/projects' || link.href === '/about') {
                if (`/${pathname.split("/")[1]}` === link.href) {
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      className={"m-1 font-medium text-primary-500 dark:text-primary-400"}>
                      {link.title}
                    </Link>
                  )
                }
              }

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100">
                  {link.title}
                </Link>
              )
            })}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
