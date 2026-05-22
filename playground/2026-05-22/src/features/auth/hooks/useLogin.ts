import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '../api/auth.api'
import type { LoginRequest } from '../types/auth.types'

export function useLogin() {
  // Zustand 스토어에서 로그인 성공 시 데이터를 저장할 함수를 가져옵니다.
  const { setAuth } = useAuthStore()

  // useMutation: 서버의 데이터를 '변경(POST/PUT/DELETE)'할 때 쓰는 리액트 쿼리 함수
  return useMutation({
    // 어떤 API 함수를 실행할지 지정
    mutationFn: (body: LoginRequest) => authApi.login(body),

    // 💡 onSuccess (로그인 성공 시 자동 실행)
    // 서버가 돌려준 응답 데이터(res.data)에서 유저 정보와 토큰을 꺼내서 Zustand 스토어에 쾅 박아줍니다!
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.accessToken)
    },
  })
}
