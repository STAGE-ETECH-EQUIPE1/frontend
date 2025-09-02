import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/shared/api/baseQuery'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import type {
  Pack,
  CreatePackFormData,
  PackResponse,
  Service,
} from '../types/pack'

export const packApi = createApi({
  reducerPath: 'packApi',
  baseQuery,
  tagTypes: ['Pack', 'Service'],
  endpoints: (builder) => ({
    // Get all packs
    getPacks: builder.query<Pack[], void>({
      query: () => API_ENDPOINTS.PACKS.LIST,
      providesTags: ['Pack'],
    }),

    // Get all services for pack creation
    getServices: builder.query<Service[], void>({
      query: () => API_ENDPOINTS.SERVICES.LIST,
      providesTags: ['Service'],
    }),

    // Create pack
    createPack: builder.mutation<PackResponse, CreatePackFormData>({
      query: (data) => ({
        url: API_ENDPOINTS.PACKS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pack'],
    }),

    // Update pack
    updatePack: builder.mutation<
      PackResponse,
      { id: number; data: CreatePackFormData }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.PACKS.UPDATE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Pack'],
    }),

    // Delete pack
    deletePack: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: API_ENDPOINTS.PACKS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Pack'],
    }),
  }),
})

export const {
  useGetPacksQuery,
  useGetServicesQuery,
  useCreatePackMutation,
  useUpdatePackMutation,
  useDeletePackMutation,
} = packApi
