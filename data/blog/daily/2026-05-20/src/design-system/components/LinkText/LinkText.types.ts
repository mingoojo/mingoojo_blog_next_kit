import type { AnchorHTMLAttributes } from 'react'

export type LinkTextVariant =
  | 'link1' // 본문 크기 링크 (16px)
  | 'link2' // 보조 크기 링크 (14px)
  | 'link3' // 작은 링크 (12px)

export type FontVariant =
  | 'head' // 본문 크기 링크 (16px)
  | 'body' // 보조 크기 링크 (14px)
  | 'caption' // 작은 링크 (12px)

export interface LinkTextProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkTextVariant
  font?: FontVariant
  external?: boolean // 새 탭 열기 여부
  underline?: boolean // 밑줄 여부 (기본값: false)
}
