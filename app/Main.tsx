import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import dayjs from 'dayjs'

const MAX_DISPLAY = 4

type HomeProps = {
  posts: CoreContent<Blog>[]
}

// 날짜 내림차순 정렬 (동일 날짜는 제목순)
const byDateDesc = (a: CoreContent<Blog>, b: CoreContent<Blog>) => {
  const diff = dayjs(b.date).diff(dayjs(a.date))
  return diff !== 0 ? diff : b.title.localeCompare(a.title)
}

// 카드 한 장 — Tag가 Link라서 카드 전체를 Link로 감싸지 않음 (중첩 anchor 방지)
function PostCard({ post }: { post: CoreContent<Blog> }) {
  const { slug, date, title, summary, tags } = post
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <time dateTime={date} className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {formatDate(date, siteMetadata.locale)}
      </time>
      <h3 className="mt-2 text-lg leading-7 font-bold tracking-tight">
        <Link
          href={`/blog/${slug}`}
          className="group-hover:text-primary-500 text-gray-900 transition-colors dark:text-gray-100">
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
        {summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((tag) => (
          <Tag key={tag} text={tag} />
        ))}
      </div>
    </article>
  )
}

// 섹션 헤더 (제목 + 전체보기 링크)
function SectionHeader({
  title,
  href,
  linkLabel,
  showLink,
}: {
  title: string
  href: string
  linkLabel: string
  showLink: boolean
}) {
  return (
    <div className="flex items-end justify-between pt-12 pb-3 mb-4">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {showLink && (
        <Link
          href={href}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium">
          {linkLabel} &rarr;
        </Link>
      )}
    </div>
  )
}

export default function Home({ posts }: HomeProps) {
  const studyPosts = posts.filter((p) => p.category !== 'work').sort(byDateDesc)
  const workPosts = posts.filter((p) => p.category === 'work').sort(byDateDesc)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 px-6 py-20 text-center dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          Hi, I'm{' '}
          <span className="relative inline-block">
            <span className="relative z-10">Mingoo Jo</span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-md bg-yellow-400 opacity-80" />
          </span>
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-gray-700 sm:text-3xl dark:text-gray-300">
          web developer
        </h2>
        <p className="mt-1 max-w-xl text-gray-500 dark:text-gray-400">{siteMetadata.description}</p>
        <Link
          href="/about"
          className="mt-4 inline-block transform rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:from-indigo-600 hover:to-blue-600">
          더보기 →
        </Link>
      </section>

      {/* 최근 작업 (Work) */}
      <SectionHeader
        title="최근 작업"
        href="/work"
        linkLabel="All Work"
        showLink={workPosts.length > MAX_DISPLAY}
      />
      {workPosts.length === 0 ? (
        <p className="pb-4 text-gray-500 dark:text-gray-400">아직 작업 글이 없어요.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 pb-4 md:grid-cols-2">
          {workPosts.slice(0, MAX_DISPLAY).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* 최근 공부 (Study) */}
      <SectionHeader
        title="최근 공부"
        href="/blog"
        linkLabel="All Study"
        showLink={studyPosts.length > MAX_DISPLAY}
      />
      {studyPosts.length === 0 ? (
        <p className="pb-4 text-gray-500 dark:text-gray-400">아직 공부 글이 없어요.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 pb-4 md:grid-cols-2">
          {studyPosts.slice(0, MAX_DISPLAY).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
