import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import type {
  SignupRequest,
  AuthResponse,
  LoginRequest,
  GoogleAuthRequest,
} from '../../types/auth'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
    }),
    googleAuth: builder.mutation<AuthResponse, GoogleAuthRequest>({
      query: ({ access_token }) => ({
        url: '/auth/google',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token }),
      }),
    }),
  }),
})

export const { useSignupMutation, useLoginMutation, useGoogleAuthMutation } =
  authApi
