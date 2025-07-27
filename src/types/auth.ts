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
}

export interface GoogleAuthRequest {
  access_token: string
}
