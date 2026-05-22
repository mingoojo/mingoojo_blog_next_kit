import { ReactNode } from 'react'

type CalloutType = 'warning' | 'tip' | 'info' | 'error'

interface CalloutProps {
  type?: CalloutType
  label?: string
  children: ReactNode
}

const config: Record<
  CalloutType,
  {
    icon: string
    bg: string
    labelColor: string
    textColor: string
  }
> = {
  error: {
    icon: '🚨',
    bg: 'bg-red-50 border border-red-100',
    labelColor: 'text-red-700',
    textColor: 'text-red-900',
  },
  warning: {
    icon: '⚠️',
    bg: 'bg-orange-50 border border-orange-100',
    labelColor: 'text-orange-700',
    textColor: 'text-orange-900',
  },
  tip: {
    icon: '💡',
    bg: 'bg-indigo-50 border border-indigo-100',
    labelColor: 'text-indigo-700',
    textColor: 'text-indigo-900',
  },
  info: {
    icon: 'ℹ️',
    bg: 'bg-blue-50 border border-blue-100',
    labelColor: 'text-blue-700',
    textColor: 'text-blue-900',
  },
}

export default function Callout({ type = 'info', label, children }: CalloutProps) {
  const { icon, bg, labelColor, textColor } = config[type]

  return (
    <div className={`my-4 flex gap-3 rounded-lg px-4 py-4 ${bg}`}>
      <span className="mt-0.5 text-base leading-none">{icon}</span>
      <div className={`text-sm leading-relaxed ${textColor} [&>p]:inline [&>p]:m-0`}>
        {label && <span className={`mr-1 font-semibold ${labelColor}`}>{`${label}  `}</span>}
        {children}
      </div>
    </div>
  )
}
