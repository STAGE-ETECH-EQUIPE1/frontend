import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@/shared/api/baseQuery'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import type {
  GenerationHistoryResponse,
  GenerationHistoryParams,
} from '../types/generationHistory'
import type { BrandingProject } from '../types/branding'

export const generationHistoryApi = createApi({
  reducerPath: 'generationHistoryApi',
  baseQuery,
  tagTypes: ['GenerationHistory', 'BrandingProject'],
  endpoints: (builder) => ({
    getGenerationHistory: builder.query<
      GenerationHistoryResponse,
      GenerationHistoryParams
    >({
      query: ({ id, size = 10, page = 1 }: GenerationHistoryParams) => ({
        url: API_ENDPOINTS.BRANDING.PROJECT_LOGOS(String(id)),
        method: 'GET',
        params: { size, page },
      }),
      providesTags: (result, error, { id }) => [
        { type: 'GenerationHistory', id },
        'GenerationHistory',
      ],
    }),

    // Liste des projets (pour afficher les projets avec leurs logos via un autre appel)
    getBrandingProjects: builder.query<BrandingProject[], void>({
      query: () => ({
        url: API_ENDPOINTS.BRANDING.PROJECTS_GET,
        method: 'GET',
      }),
      providesTags: ['BrandingProject'],
    }),

    // Supprimer un logo
    deleteLogo: builder.mutation<void, { projectId: number; logoId: number }>({
      query: ({ projectId, logoId }) => ({
        url: `${API_ENDPOINTS.BRANDING.PROJECTS_GET}/${projectId}/logos/${logoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'GenerationHistory', id: projectId },
      ],
    }),

    // Approuver un logo
    approveLogo: builder.mutation<void, { projectId: number; logoId: number }>({
      query: ({ projectId, logoId }) => ({
        url: `${API_ENDPOINTS.BRANDING.PROJECTS}/${projectId}/logos/${logoId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'GenerationHistory', id: projectId },
      ],
    }),
  }),
})

export const {
  useGetGenerationHistoryQuery,
  useGetBrandingProjectsQuery,
  useDeleteLogoMutation,
  useApproveLogoMutation,
} = generationHistoryApi
