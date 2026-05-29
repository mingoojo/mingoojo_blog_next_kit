import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'

import ListLayout from '@/layouts/ListLayoutWithTags'
import dayjs from 'dayjs'
import { genPageMetadata } from '../seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Work' })

export default async function WorkPage(props: { searchParams: Promise<{ page: string }> }) {
  const workBlogs = allBlogs.filter((p) => p.category === 'work')
  const posts = allCoreContent(sortPosts(workBlogs))

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
      title="Work"
    />
  )
}
