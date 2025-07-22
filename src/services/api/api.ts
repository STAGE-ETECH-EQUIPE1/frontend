import { baseApi } from "@/store/api/baseApi" 

// Types pour les requêtes et réponses
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

// Injection des endpoints dans l'API de base
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    getProfile: builder.query<AuthResponse["user"], void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
  }),
})

// Export des hooks générés automatiquement
export const { useLoginMutation, useSignupMutation, useLogoutMutation, useGetProfileQuery } = authApi
