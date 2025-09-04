import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/shared/api/baseQuery'
import { CreateSubscriptionRequest, Subscription } from '../types/subscription'

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery,
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    createSubscription: builder.mutation<
      Subscription,
      CreateSubscriptionRequest
    >({
      query: (subscription) => ({
        url: '/subscription/create',
        method: 'POST',
        body: subscription,
      }),
      invalidatesTags: ['Subscription'],
    }),
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => '/subscriptions',
      providesTags: ['Subscription'],
    }),
    getSubscriptionById: builder.query<Subscription, number>({
      query: (id) => `/subscription/${id}`,
      providesTags: ['Subscription'],
    }),
  }),
})

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
} = subscriptionApi
