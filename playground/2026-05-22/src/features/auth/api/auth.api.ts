import { apiClient } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  SignUpRequest,
  SignUpResponse,
} from '../types/auth.types'

//컴포넌트에서 직접 Axios를 부르지 않고, 통신 로직만 따로 빼서 모아둔 곳.
export const authApi = {
  // 1. 회원가입 API
  signUp: (body: SignUpRequest) =>
    apiClient.post<ApiResponse<SignUpResponse>>('/auth/signup', body).then((r) => r.data), // Axios의 잡다한 응답 껍데기(헤더, 상태코드 등)를 제거후 data만 반환합니다.
  // 2. 로그인 API
  login: (body: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', body).then((r) => r.data),
  // 3. 로그아웃 API
  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout').then((r) => r.data),
  // 4. 토큰 갱신 API
  refresh: () => apiClient.post<ApiResponse<RefreshResponse>>('/auth/refresh').then((r) => r.data),
}
