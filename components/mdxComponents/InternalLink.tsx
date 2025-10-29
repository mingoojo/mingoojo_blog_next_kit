// components/ImageWithCaption.tsx
import React from 'react'

type Props = {
  link: string
  name: string
  file: string
}


export default function InternalLink({
  link,
  name,
  file
}: Props) {


  const baseUrl = "https://mingoojo-blog-next-kit.vercel.app/"

  const files = [{
    name: "sqld", url: "blog/용어설명/SQLD%20관련%20용어설명"
  }]


  const fileUrl = files.filter((data) => data.name === file)

  // 혹시 해당 key가 없을 경우 대비
  if (!fileUrl || fileUrl.length !== 1) {
    console.warn(`Invalid link key: ${link}`)
    return <span>Invalid links</span>
  }

  const hre2 = `${baseUrl}${fileUrl[0].url}#${link}`

  return (
    <a href={hre2} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  )
}
