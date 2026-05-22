import TOCInline from 'pliny/ui/TOCInline'
import PlinyPre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Mermaid from '@/components/mdxComponents/Mermaid' // <- 'use client' 래퍼 or re-export
import Callout from '@/components/mdxComponents/Callout'
import CodeCompare from '@/components/mdxComponents/CodeCompare'
import CodePanel from '@/components/mdxComponents/CodePanel'

// ✅ children 구조가 어떻든 "문자열"만 끝까지 뽑아낸다
function extractTextDeep(node: any): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractTextDeep).join('')

  // React element?
  const props = (node as any)?.props
  if (props?.children != null) return extractTextDeep(props.children)

  // MDX hast 형태 호환
  if ((node as any)?.value) return String((node as any).value)

  return ''
}

function PreWithMermaid(props: any) {
  const codeEl = props?.children // 보통 <code class="language-xxx">...</code>
  const className: string = codeEl?.props?.className ?? ''

  if (className.includes('language-mermaid')) {
    const raw = extractTextDeep(codeEl).trim()
    // 안전장치: 첫 토큰이 다이어그램 키워드인지 확인
    const firstToken = raw.split(/\s+/)[0]
    const seemsMermaid =
      /^(graph|flowchart|sequenceDiagram|classDiagram|erDiagram|gantt|journey|pie|gitGraph|stateDiagram)/.test(
        firstToken,
      )
    if (!seemsMermaid) {
      // 혹시 또 꼬이면 문제 파악 쉽게 출력
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Mermaid] Unexpected chart source:', {
          firstToken,
          preview: raw.slice(0, 120),
        })
      }
    }
    return <Mermaid chart={raw} />
  }
  return <PlinyPre {...props} />
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: PreWithMermaid, // 🔁 여기만 교체
  table: TableWrapper,
  BlogNewsletterForm,
  Callout,
  CodeCompare,
  CodePanel,
}
