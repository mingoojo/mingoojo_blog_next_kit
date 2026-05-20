# 디자인 시스템 가이드

## 사용 원칙

| 역할                         | 사용 방식                                                      |
| ---------------------------- | -------------------------------------------------------------- |
| 색상, 타이포, 테두리, 그림자 | 우리 디자인 토큰 클래스 (`bg-primary`, `text-text-inverse` 등) |
| 레이아웃, 간격, 정렬         | Tailwind 기본 유틸리티 (`flex`, `gap-4`, `p-8` 등)             |

---

## Tailwind 기본 유틸리티

### Display / Layout

```
flex                → display: flex
inline-flex         → display: inline-flex
grid                → display: grid
block               → display: block
hidden              → display: none
```

### Flex

```
flex-row            → flex-direction: row
flex-col            → flex-direction: column
items-center        → align-items: center
items-start         → align-items: flex-start
justify-center      → justify-content: center
justify-between     → justify-content: space-between
flex-1              → flex: 1 1 0%
flex-shrink-0       → flex-shrink: 0
```

### Spacing (4px 기반 스케일)

```
p-1  → padding: 4px        m-1  → margin: 4px
p-2  → padding: 8px        m-2  → margin: 8px
p-3  → padding: 12px       m-3  → margin: 12px
p-4  → padding: 16px       m-4  → margin: 16px
p-6  → padding: 24px       m-6  → margin: 24px
p-8  → padding: 32px       m-8  → margin: 32px

px-4  → padding left/right: 16px
py-2  → padding top/bottom: 8px
mt-4  → margin-top: 16px
gap-4 → gap: 16px
```

### Sizing

```
w-full    → width: 100%
w-screen  → width: 100vw
h-full    → height: 100%
h-screen  → height: 100vh
w-4       → width: 16px
h-4       → height: 16px
min-w-0   → min-width: 0
max-w-sm  → max-width: 24rem (384px)
max-w-md  → max-width: 28rem (448px)
max-w-lg  → max-width: 32rem (512px)
max-w-xl  → max-width: 36rem (576px)
```

### Position

```
relative  → position: relative
absolute  → position: absolute
fixed     → position: fixed
sticky    → position: sticky
inset-0   → top/right/bottom/left: 0
top-4     → top: 16px
z-10      → z-index: 10
z-50      → z-index: 50
```

### Overflow / Visibility

```
overflow-hidden  → overflow: hidden
overflow-auto    → overflow: auto
truncate         → overflow: hidden + text-overflow: ellipsis + white-space: nowrap
opacity-50       → opacity: 0.5
invisible        → visibility: hidden
```

### Transition / Animation

```
transition-colors  → color, background-color, border-color 전환
duration-150       → transition-duration: 150ms
duration-200       → transition-duration: 200ms
animate-spin       → 회전 애니메이션 (로딩 스피너용)
```

### Interaction

```
cursor-pointer       → cursor: pointer
pointer-events-none  → pointer-events: none
select-none          → user-select: none
```

### Border / Radius

```
border           → border: 1px solid
border-2         → border: 2px solid
rounded-sm       → border-radius: 4px
rounded-md       → border-radius: 8px
rounded-lg       → border-radius: 12px
rounded-xl       → border-radius: 16px
rounded-full     → border-radius: 9999px
```

### 반응형 Prefix

```
sm:flex   → @media (min-width: 640px)  { display: flex }
md:hidden → @media (min-width: 768px)  { display: none }
lg:p-8    → @media (min-width: 1024px) { padding: 32px }
xl:w-full → @media (min-width: 1280px) { width: 100% }
```

### 상태 Prefix

```
hover:bg-primary-hover  → 마우스 올렸을 때
focus:ring-2            → 포커스 시 링
disabled:opacity-50     → 비활성 시 투명도
focus-visible:ring-2    → 키보드 포커스 시에만 링 (마우스 클릭엔 반응 안 함)
```

---

## 디자인 토큰

토큰은 3단계 계층으로 구성됨.
컴포넌트에서는 반드시 **semantic 토큰 이상**만 사용. primitive는 직접 사용 금지.

```
primitive (원색 팔레트)
    ↓
semantic (의미 부여) ← 컴포넌트에서 주로 사용
    ↓
component (컴포넌트 전용)
```

### 색상 토큰 — 브랜드

| 토큰 변수               | Tailwind 클래스                              | 용도               |
| ----------------------- | -------------------------------------------- | ------------------ |
| `--color-primary`       | `bg-primary` `text-primary` `border-primary` | 주요 액션, 버튼    |
| `--color-primary-hover` | `hover:bg-primary-hover`                     | primary hover 상태 |
| `--color-primary-light` | `bg-primary-light`                           | primary 연한 배경  |

### 색상 토큰 — 상태

| 토큰 변수               | Tailwind 클래스             | 용도                  |
| ----------------------- | --------------------------- | --------------------- |
| `--color-success`       | `bg-success` `text-success` | 성공, 완료, 결제 성공 |
| `--color-success-light` | `bg-success-light`          | 성공 연한 배경        |
| `--color-warning`       | `bg-warning` `text-warning` | 경고, 주의            |
| `--color-warning-light` | `bg-warning-light`          | 경고 연한 배경        |
| `--color-error`         | `bg-error` `text-error`     | 에러, 실패, 결제 실패 |
| `--color-error-light`   | `bg-error-light`            | 에러 연한 배경        |

### 색상 토큰 — 배경

| 토큰 변수           | Tailwind 클래스 | 용도                  |
| ------------------- | --------------- | --------------------- |
| `--color-bg-base`   | `bg-bg-base`    | 기본 페이지 배경      |
| `--color-bg-subtle` | `bg-bg-subtle`  | 카드, 섹션 구분 배경  |
| `--color-bg-muted`  | `bg-bg-muted`   | 비활성 영역, 스켈레톤 |

### 색상 토큰 — 텍스트

| 토큰 변수                | Tailwind 클래스       | 용도                  |
| ------------------------ | --------------------- | --------------------- |
| `--color-text-primary`   | `text-text-primary`   | 본문 텍스트           |
| `--color-text-secondary` | `text-text-secondary` | 보조 텍스트, 설명     |
| `--color-text-disabled`  | `text-text-disabled`  | 비활성 텍스트         |
| `--color-text-inverse`   | `text-text-inverse`   | 어두운 배경 위 텍스트 |

### 색상 토큰 — 테두리

| 토큰 변수               | Tailwind 클래스        | 용도        |
| ----------------------- | ---------------------- | ----------- |
| `--color-border`        | `border-border`        | 기본 테두리 |
| `--color-border-strong` | `border-border-strong` | 강조 테두리 |
| `--color-border-focus`  | `ring-border-focus`    | 포커스 링   |

### 결제 전용 토큰 (CSS 변수 직접 사용)

```css
var(--payment-success-bg)    /* 결제 성공 배경 */
var(--payment-success-text)  /* 결제 성공 텍스트 */
var(--payment-error-bg)      /* 결제 실패 배경 */
var(--payment-error-text)    /* 결제 실패 텍스트 */
var(--payment-pending-bg)    /* 결제 진행 중 배경 */
var(--payment-pending-text)  /* 결제 진행 중 텍스트 */
```

---

## 컴포넌트

### Button

```tsx
import { Button } from '@/design-system'

// variant
<Button variant="primary">결제하기</Button>    // 주요 액션
<Button variant="secondary">취소</Button>      // 보조 액션
<Button variant="outline">더보기</Button>      // 외곽선
<Button variant="ghost">닫기</Button>          // 텍스트형
<Button variant="danger">삭제</Button>         // 위험 액션

// size
<Button size="sm">작은 버튼</Button>           // 32px
<Button size="md">기본 버튼</Button>           // 40px (기본값)
<Button size="lg">큰 버튼</Button>             // 48px

// 상태
<Button isLoading>처리 중</Button>             // 로딩 스피너 + 비활성
<Button disabled>비활성</Button>               // 비활성

// 추가 클래스 주입 (w-full 등 레이아웃 오버라이드)
<Button variant="primary" className="w-full">전체 너비</Button>
```

---

## 자주 쓰는 패턴

### 카드

```tsx
<div className="bg-bg-base border border-border rounded-lg shadow-sm p-6">카드 내용</div>
```

### 폼 인풋 래퍼

```tsx
<div className="flex flex-col gap-1">
  <label className="text-sm text-text-secondary">이메일</label>
  <input className="h-10 px-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-border-focus" />
</div>
```

### 상태 뱃지

```tsx
// 결제 성공
<span className="bg-success-light text-success text-xs px-2 py-1 rounded-full">
  결제 완료
</span>

// 결제 실패
<span className="bg-error-light text-error text-xs px-2 py-1 rounded-full">
  결제 실패
</span>
```

### 페이지 레이아웃

```tsx
<div className="min-h-screen bg-bg-subtle">
  <div className="max-w-xl mx-auto px-4 py-8">페이지 내용</div>
</div>
```
