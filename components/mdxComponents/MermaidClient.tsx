'use client'

import { useEffect, useRef, useState } from 'react'

export default function MermaidClient({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const [title, setTitle] = useState('')

  useEffect(() => {
    const titleMatch = chart.match(/<<([^<>]+)>>/)

    if (titleMatch) {
      setTitle(titleMatch[1].trim())
    }

    const diagram = chart.replace(/<<[^<>]+>>/, '').trim()

    let mounted = true
      ; (async () => {
        const { default: mermaid } = await import('mermaid/dist/mermaid.esm.min.mjs')

        mermaid.initialize({
          theme: 'neutral',
          securityLevel: 'loose',
          flowchart: {
            htmlLabels: true,
            useMaxWidth: false,      // ✅ foreignObject 폭/높이 계산 안정화
            diagramPadding: 16,
            nodeSpacing: 40,
            rankSpacing: 50,
          },
        })

        if (!mounted || !ref.current) return
        const id = 'mermaid-' + Math.random().toString(36).slice(2)
        const { svg } = await mermaid.render(id, diagram)
        ref.current.innerHTML = svg
        const svgEl = ref.current.querySelector('svg') as SVGSVGElement | null
        if (svgEl) {
          svgEl.style.overflow = 'visible' // ✅ 혹시 모를 잘림 2차 방지
        }
      })()
    return () => {
      mounted = false
    }
  }, [chart])

  return (
    <div>
      <div
        className="mermaid"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          paddingBlock: '30px',
          borderRadius: '8px',
          height: '100%'
        }}
        ref={ref}
      />

      {title !== '' && (
        <figcaption
          style={{
            fontSize: '0.9rem',
            color: '#666',
            marginTop: '8px',
            textAlign: 'center',
          }}>
          {`[ ${title} ]`}
        </figcaption>
      )}
    </div>
  )
}
