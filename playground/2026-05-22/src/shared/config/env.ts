// Zod는 TypeScript 환경에서 아주 강력한 스키마 선언 및 데이터 검증(Validation) 라이브러리
//외부에서 주입되는 환경변수(.env)가 제대로 설정되었는지 앱 실행 초기에 검사하여, 런타임 에러를 미연에 방지하는 데 사용

import { z } from 'zod'

// 1. 스키마(Schema) 정의
// 우리 앱에서 사용할 환경변수의 '모양(타입과 조건)'을 정의
const envSchema = z.object({
  // VITE_API_BASE_URL은 반드시 '문자열(string)'이어야 하며, '유효한 URL 주소 형식'이어야 한다.
  VITE_API_BASE_URL: z.string().url(),

  // VITE_APP_ENV는 주어진 3개의 문자열 중 하나만 올 수 있다 (enum).
  // 만약 .env 파일에 이 값이 적혀있지 않다면, 기본값(default)으로 'development'를 사용.
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),

  // VITE_APP_NAME은 기본 앱의 이름이다. 없으면 Rinex Cloud로 사용함
  VITE_APP_NAME: z.string().default('Rinex Cloud'),

  //msw를 사용할지 결정
  VITE_MSW_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default(false),
})

// 2. 데이터 검증 (Parsing)
// Vite 환경에서 제공하는 실제 환경변수 객체(import.meta.env)를 위에서 만든 스키마에 넣어 검사.
// 'safeParse'는 에러를 강제로 발생시키지 않고, 성공 여부(success)와 결과 데이터를 담은 객체를 반환합니다.
const parsed = envSchema.safeParse(import.meta.env)

// 3. 에러 핸들링
// 검증에 실패했다면 (!parsed.success) 즉, URL 형식이 틀렸거나 필수 값이 없다면 아래 코드가 실행됩니다.
if (!parsed.success) {
  // 에러 객체를 보기 좋게 평탄화(flatten)하여 어떤 필드(변수)에서 오류가 났는지 콘솔에 출력합니다.
  console.error('환경변수 설정 오류:', parsed.error.flatten().fieldErrors)

  // 에러를 던져서 애플리케이션 실행을 즉시 중단시킵니다.
  // (환경변수가 잘못된 상태로 앱이 켜져서 나중에 원인 모를 버그가 터지는 것을 막기 위함입니다.)
  throw new Error('필수 환경변수가 누락되었습니다. .env 파일을 확인하세요.')
}

// 4. 안전한 데이터 추출 및 내보내기
// 검증을 무사히 통과한 안전한 환경변수 데이터를 'env'라는 이름으로 내보냅니다.
// 이제 다른 파일에서 이 env를 가져다 쓰면, VITE_API_BASE_URL이 무조건 존재하고 URL 형식임을 타입스크립트가 보장해 줍니다.
export const env = parsed.data
