import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import dayjs from 'dayjs'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const posts = allCoreContent(sortPosts(allBlogs))

  posts.sort((a, b) => {
    const a_date = dayjs(a.date)
    const b_date = dayjs(b.date)

    if (b_date.diff(a_date) !== 0) {
      return b_date.diff(a_date)
    } else {
      return b.title.localeCompare(a.title)
    }
  })

  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
