import { sortPosts, allCoreContent, CoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, Blog } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts: Blog[] = sortPosts(allBlogs)
  const posts: CoreContent<Blog>[] = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
