import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/shared/api/baseQuery'
import { User } from '../types/user'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import { SubscriptionResponse } from '../types/subscription'
import { ApiResponse } from '@/types/service'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.ME,
        method: 'GET',
      }),
      transformResponse: (response: { message: string; data: User }) =>
        response.data,
    }),
    getSubscriptionForCurrentUser: builder.query<
      ApiResponse<SubscriptionResponse>,
      void
    >({
      query: () => ({
        url: API_ENDPOINTS.USER.CURRENT_USER_SUBSCRIPTION,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetCurrentUserQuery, useGetSubscriptionForCurrentUserQuery } =
  userApi
