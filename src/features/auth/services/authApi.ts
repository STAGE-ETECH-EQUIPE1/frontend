import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/shared/api/baseQuery'
import {
  AuthResponse,
  GoogleAuthRequest,
  LoginRequest,
  SignupRequest,
} from '../types/auth'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: data,
      }),
    }),
    googleAuth: builder.mutation<AuthResponse, GoogleAuthRequest>({
      query: ({ access_token }) => ({
        url: API_ENDPOINTS.AUTH.GOOGLE_AUTH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token }),
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { token: string; newPassword: string; confirmPassword: string }
    >({
      query: ({ token, newPassword, confirmPassword }) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD(token),
        method: 'POST',
        body: { currentPassword: token, newPassword, confirmPassword },
      }),
    }),
  }),
})

export const {
  useSignupMutation,
  useLoginMutation,
  useGoogleAuthMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
} = authApi
