# 조민구의 개발 블로그

### 개발 블로그입니다.

[![Deploy with Vercel](https://vercel.com/button)](https://mingoojo-blog-next-kit.vercel.app)

## 🛠 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Content**: MDX + Contentlayer
- **Deployment**: Vercel
- **Lint & Format**: ESLint, Prettier

## 📝 커밋 규칙

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/ko/) 규칙을 따릅니다.
Husky + commitlint로 규칙에 맞지 않는 커밋은 자동 차단됩니다.

| 타입       | 용도                    | 예시                                  |
| ---------- | ----------------------- | ------------------------------------- |
| `feat`     | 새 기능                 | `feat: 다크모드 토글 추가`            |
| `fix`      | 버그 수정               | `fix: 모바일 메뉴 닫힘 오류 수정`     |
| `docs`     | 문서 변경               | `docs: README 기술 스택 업데이트`     |
| `style`    | 포맷팅 (동작 변화 없음) | `style: 들여쓰기 수정`                |
| `refactor` | 리팩토링                | `refactor: 블로그 목록 컴포넌트 분리` |
| `chore`    | 빌드, 설정 등 기타      | `chore: husky 설정 추가`              |
| `test`     | 테스트 추가/수정        | `test: 검색 기능 유닛 테스트 추가`    |
| `perf`     | 성능 개선               | `perf: 이미지 lazy loading 적용`      |
| `ci`       | CI 설정 변경            | `ci: GitHub Actions 워크플로우 수정`  |

> ⚠️ 콜론 뒤에 **공백 필수** — `feat:추가` ✖ `feat: 추가` ✔

> 이슈 브랜치(`JIRA-123-feature` 등)에서 커밋하면 `[JIRA-123]`이 메시지 앞에 자동 삽입됩니다.
