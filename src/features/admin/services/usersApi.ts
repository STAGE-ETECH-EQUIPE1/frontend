import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/shared/api/baseQuery'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import type { User } from '../types/user'

export const usersApi = createApi({
  reducerPath: 'usersManagement',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: API_ENDPOINTS.USER.LIST,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: `user/update/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `user/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    sendEmailToUser: builder.mutation<
      void,
      { userId: string; subject: string; message: string }
    >({
      query: ({ userId, subject, message }) => ({
        url: `user/send-email/${userId}`,
        method: 'POST',
        body: { subject, message },
      }),
    }),
  }),
})

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSendEmailToUserMutation,
} = usersApi
