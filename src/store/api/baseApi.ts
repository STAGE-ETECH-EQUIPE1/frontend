import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token

      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }

      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["User", "Auth"],
  endpoints: () => ({}),
})
