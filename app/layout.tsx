import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import Script from 'next/script'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${basePath}/static/favicons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/static/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/static/favicons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
        <link
          rel="mask-icon"
          href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />

        {/* 전역 CSS로 선택/드래그 기본 차단 + 예외 클래스 제공 */}
        <style
          // 정적 CSS라 hydration 문제 없음
          dangerouslySetInnerHTML={{
            __html: `
            html, body, * { -webkit-user-drag: none; }
            html, body {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            input, textarea, [contenteditable="true"], input *, textarea *, [contenteditable="true"] * {
              -webkit-user-select: text;
              -moz-user-select: text;
              -ms-user-select: text;
              user-select: text;
            }
            .allow-select, .allow-select * {
              -webkit-user-select: text !important;
              -moz-user-select: text !important;
              -ms-user-select: text !important;
              user-select: text !important;
            }
            img { pointer-events: none; }
          `,
          }}
        />
      </head>

      <body
        className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white"
        suppressHydrationWarning
      >
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>

        {/* ⬇ 복사/우클릭/드래그 등 이벤트 차단 (입력/에디터는 예외) */}
        <Script id="guard-copy-drag" strategy="afterInteractive">
          {`
            (function () {
              const isEditable = (el) => {
                if (!el) return false;
                const tag = el.tagName?.toLowerCase();
                const editable =
                  el.isContentEditable ||
                  tag === 'input' ||
                  tag === 'textarea' ||
                  el.closest('[contenteditable="true"]');
                return !!editable;
              };

              const block = (e) => {
                if (isEditable(e.target)) return; // 입력 영역은 허용
                e.preventDefault();
              };

              // 마우스 관련
              document.addEventListener('contextmenu', block, { capture: true });
              document.addEventListener('dragstart', block, { capture: true });
              document.addEventListener('selectstart', block, { capture: true });

              // 클립보드 관련
              document.addEventListener('copy', block, { capture: true });
              document.addEventListener('cut', block, { capture: true });

              // 키보드 단축키(Ctrl/Cmd+C / X / S / P / U 등) - 입력창 예외
              document.addEventListener('keydown', (e) => {
                if (isEditable(e.target)) return;
                const mod = e.ctrlKey || e.metaKey;
                if (
                  (mod && ['c','x','s','p','u','a'].includes(e.key.toLowerCase())) ||
                  e.key === 'PrintScreen'
                ) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }, { capture: true });
            })();
            `}
        </Script>
      </body>
    </html>
  )
}
