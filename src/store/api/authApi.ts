import { baseApi } from "./baseApi"

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
  }
  token: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login", // ✅ Vos URLs sont correctes
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: "/register", // ✅ Correct
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    getProfile: builder.query<AuthResponse["user"], void>({
      query: () => "/profile", // ✅ Simplifié
      providesTags: ["User"],
    }),
  }),
})

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useGetProfileQuery } = authApi
