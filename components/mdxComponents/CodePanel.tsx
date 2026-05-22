import { ReactNode } from 'react'

type PanelType = 'bad' | 'good' | 'info'

interface CodePanelProps {
  type: PanelType
  title: string
  children: ReactNode
}

const config: Record<
  PanelType,
  { icon: string; bg: string; border: string; titleColor: string; codeBg: string }
> = {
  bad: {
    icon: '❌',
    bg: 'bg-red-50',
    border: 'border-red-200',
    titleColor: 'text-red-700',
    codeBg: 'bg-red-50',
  },
  good: {
    icon: '✅',
    bg: 'bg-green-50',
    border: 'border-green-200',
    titleColor: 'text-green-700',
    codeBg: 'bg-green-50',
  },
  info: {
    icon: 'ℹ️',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    titleColor: 'text-gray-600',
    codeBg: 'bg-gray-50',
  },
}

export default function CodePanel({ type, title, children }: CodePanelProps) {
  const { icon, bg, border, titleColor, codeBg } = config[type]

  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border ${border}`}>
      {/* 타이틀 */}
      <div
        className={`${bg} border-b ${border} text-sx px-4 py-2.5 font-bold uppercase tracking-wide ${titleColor}`}>
        {icon} {title}
      </div>
      {/* 코드 영역 — prism 배경 제거하고 패널 색으로 통일 */}
      <div
        className={`
        flex-1
        ${codeBg}
        [&_pre]:!bg-transparent
        [&_pre]:!shadow-none
        [&_pre]:m-0
        [&_pre]:rounded-none
        [&_pre]:border-0
        [&_pre]:p-4
        [&_pre]:text-[12px]
        [&_code]:!bg-transparent
        [&_code]:!text-gray-800
        [&_.token.keyword]:!text-violet-700
        [&_.token.string]:!text-emerald-700
        [&_.token.function]:!text-blue-700
        [&_.token.number]:!text-orange-600
        [&_.token.operator]:!text-gray-600
        [&_.token.punctuation]:!text-gray-500
        [&_.token.comment]:!text-gray-400
        [&_.token.boolean]:!text-orange-600
        [&_.token.parameter]:!text-gray-700
      `}>
        {children}
      </div>
    </div>
  )
}
