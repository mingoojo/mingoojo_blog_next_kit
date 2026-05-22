import type { User } from '@/entities/user'

// [서버로 보낼 때(Request) 데이터]
export interface SignUpRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

// [서버에서 받을 때(Response) 데이터]
export interface LoginResponse {
  accessToken: string
  user: User
}

export interface SignUpResponse {
  id: string
  email: string
  name: string
}

export interface RefreshResponse {
  accessToken: string
  user: User
}
