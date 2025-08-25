import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { jwtDecode } from 'jwt-decode'
import { getToken, removeToken } from '@/shared/utils/localStorage'

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    const token = getToken()
if (token) {
  try {
    interface JwtPayload {
      exp: number
      [key: string]: unknown
    }
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token)
    if (decoded.exp * 1000 < Date.now()) {
      removeToken()
    } else {
      headers.set('Authorization', `Bearer ${token}`)
    }
  } catch {
    removeToken()
  }
}
    return headers
  },
})

