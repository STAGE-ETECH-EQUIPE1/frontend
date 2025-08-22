export interface SignupRequest {
  email: string
  phone: string
  fullName: string
  username: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  roles: ('ROLE_ADMIN' | 'ROLE_CLIENT' | 'ROLE_USER')[]
}

export interface GoogleAuthRequest {
  access_token: string
}

export type ResetPasswordPayload = {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface DecodedToken {
  email: string
  roles: string[]
  exp: number
  sub: string
}
