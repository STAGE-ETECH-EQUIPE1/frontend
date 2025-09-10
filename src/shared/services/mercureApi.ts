import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const mercureApi = createApi({
  reducerPath: 'mercureApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_MERCURE_HUB,
    prepareHeaders: async (headers) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mercure/token`,
        {}
      )
      if (res.ok) {
        const { token } = await res.json()
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    publish: builder.mutation<string, { topic: string; data: unknown }>({
      query: ({ topic, data }) => {
        const body = new URLSearchParams()
        body.append('topic', topic)
        body.append('data', JSON.stringify(data))

        return {
          url: '/.well-known/mercure', // ajouté au hub
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        }
      },
      transformResponse: (response: string) => response,
    }),
  }),
})

export const { usePublishMutation } = mercureApi
