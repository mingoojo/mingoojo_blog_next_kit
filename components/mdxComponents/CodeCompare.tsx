import { ReactNode } from 'react'

interface CodeCompareProps {
  children: ReactNode
}

export default function CodeCompare({ children }: CodeCompareProps) {
  return <div className="my-6 grid grid-cols-1 gap-2 md:grid-cols-2">{children}</div>
}
