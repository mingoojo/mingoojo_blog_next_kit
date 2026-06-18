/**
 * blog-review-eval.ts  —  블로그 MDX 검수 + eval 하니스 (v0 스캐폴드)
 *
 * 핵심 아이디어
 * ─────────────
 * "글 검수"는 주관적이라 그냥 돌리면 점수를 못 매긴다.
 * 그래서 '깨끗한 글'에 '내가 아는 결함'을 주입(inject)하고,
 * AI가 그 결함을 잡아내는지로 recall / precision / 오탐률 / 비용을 측정한다.
 *
 * 실행:
 *   export ANTHROPIC_API_KEY=sk-...
 *   npm i @anthropic-ai/sdk
 *   npx tsx blog-review-eval.ts ./posts   # posts 디렉터리의 .mdx 들로 eval
 */

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const client = new Anthropic() // ANTHROPIC_API_KEY 환경변수 사용

// 모델 스왑 지점: haiku(싸다) ↔ sonnet(균형) ↔ opus(정확). eval로 직접 비교해봐.
const MODEL = 'claude-sonnet-4-6'

// 비용 모델링: 아래 단가는 *직접 현재 가격을 확인해서* 넣어라 (per 1M tokens).
// 가격은 수시로 바뀌니 하드코딩 신뢰 금지 — 이걸 채우는 것 자체가 비용 모델링 연습이다.
const PRICE_PER_MTOK = { input: 0, output: 0 } // TODO: 현재 단가 입력

// ── 1. 결함 타입 ──────────────────────────────────────────
type DefectType = 'typo' | 'broken_code' | 'broken_link' | 'broken_markdown'

interface InjectedDefect {
  type: DefectType
  line: number // 0-based, 결함이 들어간 라인
}

// ── 2. 결함 주입기 ────────────────────────────────────────
// 깨끗한 본문(line 배열)에 결함을 심고, 무엇을/어디에 심었는지 기록한다.
function injectDefects(lines: string[]): { lines: string[]; defects: InjectedDefect[] } {
  const out = [...lines]
  const defects: InjectedDefect[] = []

  // (a) typo: 평범한 산문 라인에서 한 글자 중복
  const proseIdx = out.findIndex(
    (l) => l.trim().length > 30 && !l.startsWith('#') && !l.startsWith('```') && !l.includes(']('),
  )
  if (proseIdx >= 0) {
    out[proseIdx] = out[proseIdx].replace(/(\S)(\s)/, '$1$1$2') // 첫 글자 하나 중복
    defects.push({ type: 'typo', line: proseIdx })
  }

  // (b) broken_code: 코드펜스 안에 닫히지 않은 괄호 라인 삽입
  const fenceStart = out.findIndex((l) => l.trim().startsWith('```') && l.trim().length > 3)
  if (fenceStart >= 0) {
    out.splice(fenceStart + 1, 0, 'const broken = (1 + 2') // 의도적 미완성
    defects.push({ type: 'broken_code', line: fenceStart + 1 })
  }

  // (c) broken_link: 정상 마크다운 링크의 URL을 깨뜨림
  const linkIdx = out.findIndex((l) => /\]\(https?:\/\//.test(l))
  if (linkIdx >= 0) {
    out[linkIdx] = out[linkIdx].replace(/\]\(https?:\/\//, '](http//') // 콜론 누락
    defects.push({ type: 'broken_link', line: linkIdx })
  }

  // (d) broken_markdown: 닫히지 않은 볼드 삽입
  if (proseIdx >= 0 && proseIdx + 1 < out.length) {
    out.splice(proseIdx + 1, 0, '이 문장은 **볼드가 안 닫힌다 그리고 계속된다.')
    defects.push({ type: 'broken_markdown', line: proseIdx + 1 })
  }

  return { lines: out, defects }
}

// ── 3. 리뷰어 (구조화 출력 = tool use) ────────────────────
interface Finding {
  type: DefectType | 'other'
  line: number
  description: string
}

const REVIEW_TOOL: Anthropic.Tool = {
  name: 'report_issues',
  description: '검수에서 발견한 모든 이슈를 구조화해 보고한다.',
  input_schema: {
    type: 'object',
    properties: {
      findings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['typo', 'broken_code', 'broken_link', 'broken_markdown', 'other'],
            },
            line: { type: 'number', description: '이슈가 있는 1-based 라인 번호' },
            description: { type: 'string' },
          },
          required: ['type', 'line', 'description'],
        },
      },
    },
    required: ['findings'],
  },
}

async function review(mdx: string): Promise<{ findings: Finding[]; usage: Anthropic.Usage }> {
  const numbered = mdx
    .split('\n')
    .map((l, i) => `${i + 1}: ${l}`)
    .join('\n')

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    tools: [REVIEW_TOOL],
    tool_choice: { type: 'tool', name: 'report_issues' },
    messages: [
      {
        role: 'user',
        content:
          '다음은 기술 블로그 글(MDX)이다. 오타, 깨진 코드, 깨진 링크, 망가진 마크다운을 찾아 ' +
          'report_issues 도구로 보고하라. 라인 번호는 각 줄 앞에 붙어 있다.\n\n' +
          numbered,
      },
    ],
  })

  const toolUse = res.content.find((b) => b.type === 'tool_use')
  const findings = toolUse ? ((toolUse as any).input.findings as Finding[]) : []
  // 라인 번호를 0-based로 정규화 (주입기와 맞추기)
  return { findings: findings.map((f) => ({ ...f, line: f.line - 1 })), usage: res.usage }
}

// ── 4. 매칭 & 채점 ────────────────────────────────────────
const LINE_TOL = 2 // 라인 오차 허용 (근사 매칭)

function score(injected: InjectedDefect[], findings: Finding[]) {
  const used = new Set<number>()
  let caught = 0
  const perType: Record<string, { caught: number; total: number }> = {}

  for (const d of injected) {
    perType[d.type] ??= { caught: 0, total: 0 }
    perType[d.type].total++
    const hit = findings.findIndex(
      (f, idx) => !used.has(idx) && f.type === d.type && Math.abs(f.line - d.line) <= LINE_TOL,
    )
    if (hit >= 0) {
      used.add(hit)
      caught++
      perType[d.type].caught++
    }
  }

  const recall = injected.length ? caught / injected.length : 0
  const precision = findings.length ? caught / findings.length : 0 // 근사치
  return { recall, precision, caught, perType }
}

// ── 5. 실행 ───────────────────────────────────────────────
async function main() {
  const dir = process.argv[2] ?? './posts'
  const files = readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
  if (!files.length) {
    console.error(`'${dir}' 에 .mdx/.md 글이 없다.`)
    process.exit(1)
  }

  let totRecall = 0
  let baselineFP = 0 // 깨끗한 원본에서 나온 오탐 수
  let inTok = 0
  let outTok = 0
  const agg: Record<string, { caught: number; total: number }> = {}

  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf8')
    const lines = raw.split('\n')

    // (1) 결함 주입판으로 detection 측정
    const { lines: corrupted, defects } = injectDefects(lines)
    const r = await review(corrupted.join('\n'))
    const s = score(defects, r.findings)
    totRecall += s.recall
    inTok += r.usage.input_tokens
    outTok += r.usage.output_tokens
    for (const [t, v] of Object.entries(s.perType)) {
      agg[t] ??= { caught: 0, total: 0 }
      agg[t].caught += v.caught
      agg[t].total += v.total
    }

    // (2) 깨끗한 원본으로 baseline 오탐률 측정
    const clean = await review(raw)
    baselineFP += clean.findings.length
    inTok += clean.usage.input_tokens
    outTok += clean.usage.output_tokens

    console.log(
      `${file}  recall=${(s.recall * 100).toFixed(0)}%  ` +
        `(${s.caught}/${defects.length})  baseline오탐=${clean.findings.length}`,
    )
  }

  const cost = (inTok / 1e6) * PRICE_PER_MTOK.input + (outTok / 1e6) * PRICE_PER_MTOK.output

  console.log('\n── 종합 ───────────────')
  console.log(`모델: ${MODEL}`)
  console.log(`평균 recall: ${((totRecall / files.length) * 100).toFixed(1)}%`)
  console.log('타입별 recall:')
  for (const [t, v] of Object.entries(agg)) {
    console.log(`  ${t}: ${((v.caught / v.total) * 100).toFixed(0)}% (${v.caught}/${v.total})`)
  }
  console.log(`baseline 총 오탐: ${baselineFP} (낮을수록 좋음)`)
  console.log(`토큰: in=${inTok} out=${outTok}  예상비용=$${cost.toFixed(4)}`)
}

main().catch(console.error)
