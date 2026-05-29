import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'

import { Metadata } from 'next'
import dayjs from 'dayjs'
import { genPageMetadata } from '../../../seo'

const POSTS_PER_PAGE = 5

// work 섹션 글만
const workBlogs = () => allBlogs.filter((p) => p.category === 'work')

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: decodeURI(tag),
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/work/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const workTags = new Set<string>()
  workBlogs().forEach((p) => p.tags?.forEach((t) => workTags.add(slug(t))))
  return Array.from(workTags).map((tag) => ({ tag: encodeURI(tag) }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(decodeURI(params.tag))
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      workBlogs().filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)),
    ),
  )

  filteredPosts.sort((a, b) => {
    const a_date = dayjs(a.date)
    const b_date = dayjs(b.date)
    if (b_date.diff(a_date) !== 0) {
      return b_date.diff(a_date)
    } else {
      return b.title.localeCompare(a.title)
    }
  })

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
