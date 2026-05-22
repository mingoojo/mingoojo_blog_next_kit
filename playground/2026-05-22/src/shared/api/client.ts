import axios, { AxiosError } from 'axios'
import { env } from '@/shared/config/env'
import type { ApiError } from './types'
import { useAuthStore } from '@/store'

// 1. 커스텀 Axios 인스턴스 생성
export const apiClient = axios.create({
  // 모든 요청의 기본 주소가 됩니다. (예: https://api.my-domain.com/api)
  // 이렇게 해두면 나중에 apiClient.get('/users')만 해도 알아서 앞부분이 붙습니다.
  baseURL: env.VITE_API_BASE_URL,

  // timeout (제한 시간)
  // 10,000ms (10초) 동안 서버가 답이 없으면, 무한정 기다리지 않고 강제로 에러를 냅니다.
  timeout: 10_000,

  // 기본 헤더 설정: "우리가 보내는 데이터는 기본적으로 JSON 형식이야"라고 서버에 알려줍니다.
  headers: {
    'Content-Type': 'application/json',
  },

  // 쿠키에 있는 리프레시 토큰을 첨부할수 있게 허용하는 요청
  withCredentials: true,
})

// 2. 요청 인터셉터
apiClient.interceptors.request.use((config) => {
  // useAuthStore에서 로그인 토큰을 꺼내옵니다.
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    // 모든 요청의 'Authorization(권한)' 헤더에 토큰을 자동으로 달아줍니다.
    // 'Bearer'는 JWT 토큰을 보낼 때 쓰는 일종의 관례적인 접두사입니다.
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  // 토큰을 달았든 안 달았든, 최종적으로 수정된 요청(config)을 서버로 출발.
  return config
})

// 3. 응답 인터셉터
apiClient.interceptors.response.use(
  // 정상 응답일 경우: 아무것도 안 건드리고 그냥 그대로 통과시킵니다.
  (response) => response,

  // 에러 응답일 경우: 컴포넌트로 에러가 넘어가기 전에 여기서 먼저 확인합니다.
  (error: AxiosError<ApiError>) => {
    // 서버가 보내온 HTTP 상태 코드를 확인합니다. (예: 404, 500 등)
    const status = error.response?.status

    const requestUrl = error.config?.url ?? ''

    // 로그인/회원가입 요청은 401이 정상 비즈니스 에러 (인증 실패)
    // → 리다이렉트 하면 안 됨, onError 콜백이 처리하게 넘김
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signup')

    // 401 코드는 'Unauthorized (인증 실패)'를 의미합니다.
    // 즉, 토큰이 만료되었거나 조작되어서 로그인이 풀렸다는 뜻입니다.
    if (status === 401 && !isAuthEndpoint) {
      // useAuthStore에 토큰 초기화
      useAuthStore.getState().clearAuth()

      // 사용자를 강제로 로그인 페이지로 쫓아냅니다(리다이렉트).
      window.location.href = '/login'
    }

    // 401 처리를 했더라도, 화면단(컴포넌트)에서도 에러가 났다는 걸 알아야 하므로
    // 원래 발생했던 에러를 그대로 다시 던져줍니다 (React Query가 이 에러를 받게 됩니다).
    return Promise.reject(error)
  },
)
