// components/ImageWithCaption.tsx
import React from 'react'

type Props = {
  link: string
  name: string
}


export default function InternalLink({
  link,
  name,
}: Props) {


  const baseUrl = "https://mingoojo-blog-next-kit.vercel.app/"

  const urls = {
    author: "Jo Mingu",
    github: "https://github.com/jomingu",
    project: "KPOP-MultiModule",
    schema: `${baseUrl}/blog/sqld/[%EC%9E%90%EA%B2%A9%EC%A6%9D]SQLD%20%EA%B4%80%EB%A0%A8%20%EC%9A%A9%EC%96%B4%EC%84%A4%EB%AA%85#%EC%8A%A4%ED%82%A4%EB%A7%88schema`,
    transaction: `${baseUrl}/blog/sqld/[자격증]SQLD%20관련%20용어설명#트랜젝션transaction`
  }


  const href = urls[link as keyof typeof urls]


  // 혹시 해당 key가 없을 경우 대비
  if (!href) {
    console.warn(`Invalid link key: ${link}`)
    return <span>Invalid links</span>
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  )
}
