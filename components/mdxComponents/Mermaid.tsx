'use client'
import dynamic from 'next/dynamic'

const MermaidClient = dynamic(() => import('./MermaidClient'), { ssr: false })

export default function Mermaid(props: { chart: string }) {
  return <MermaidClient {...props} />
}
