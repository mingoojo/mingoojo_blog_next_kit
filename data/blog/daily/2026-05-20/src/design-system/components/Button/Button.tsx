import { cva } from 'class-variance-authority'
import type { ButtonProps } from './Button.types'
import { twMerge } from 'tailwind-merge'

/*
  cva(base, variants)
  - base: 모든 버튼에 공통으로 붙는 클래스
  - variants: variant/size 조합별 클래스
  
  export하는 이유: Button.types.ts에서 VariantProps<typeof buttonVariants>로
  타입을 자동 추출하기 위함
*/
export const buttonVariants = cva(
  // 공통 base 클래스
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      /*
        variant: 버튼의 시각적 역할
        토큰 클래스 (bg-primary 등)는 semantic.css의 @theme 변수가 Tailwind 클래스로 변환된 것
      */
      variant: {
        primary: 'bg-primary text-text-inverse hover:bg-primary-hover',
        secondary: 'bg-bg-muted text-text-primary hover:bg-bg-subtle border border-border',
        outline: 'border border-border text-text-primary hover:bg-bg-subtle bg-transparent',
        ghost: 'text-text-primary hover:bg-bg-muted bg-transparent',
        danger: 'bg-error text-text-inverse hover:opacity-90',
        //하이픈을 쓸때는 따옴표 필수임
        // 흰 배경 + primary(violet) 테두리
        'outline-primary':
          'bg-white border border-primary text-primary hover:bg-primary-light rounded-[10px]',
      },
      // size: 버튼의 크기 — component.css의 --btn-height-* 토큰과 맞춤
      size: {
        sm: 'h-8 px-4 text-sm rounded-md',
        md: 'h-10 px-5 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

// 로딩 스피너 — 버튼 내부 전용 컴포넌트라 외부 export 안 함
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function Button({
  variant,
  size,
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // twMerge: 충돌하는 Tailwind 클래스 자동 해결
      // 예) rounded-md vs rounded-[10px] → 나중 것이 이김
      className={twMerge(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}>
      {isLoading && <Spinner />}
      {children}
    </button>
  )
}
