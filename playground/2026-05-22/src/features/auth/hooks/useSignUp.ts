import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import type { SignUpRequest } from '../types/auth.types'

export function useSignUp() {
  // 회원가입은 로그인처럼 바로 전역 상태에 무언가를 저장할 필요가 없으므로,
  // 깔끔하게 통신 로직(mutationFn)만 연결해 줍니다.
  return useMutation({
    mutationFn: (body: SignUpRequest) => authApi.signUp(body),
  })
}
