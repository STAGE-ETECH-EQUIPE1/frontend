import { createApi, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "@/shared/api/baseQuery"
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoint" 
import type {
  BrandingProject,
  CreateBrandingProjectRequest,
  CreateBrandingProjectResponse,
  ProjectLogosResponse,
} from "../types/branding"
import { SerializedError } from "@reduxjs/toolkit"

export const brandingApi = createApi({
  reducerPath: "brandingApi",
  baseQuery,
  tagTypes: ["BrandingProject", "ProjectLogos"],
  endpoints: (builder) => ({
    // Créer un nouveau projet de branding
    createBrandingProject: builder.mutation<CreateBrandingProjectResponse, CreateBrandingProjectRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.BRANDING.PROJECTS,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BrandingProject"],
    }),

    // Récupérer tous les projets de branding
    getBrandingProjects: builder.query<BrandingProject[], void>({
      query: () => ({
        url: API_ENDPOINTS.BRANDING.PROJECTS,
        method: "GET",
      }),
      providesTags: ["BrandingProject"],
    }),

    // Récupérer un projet spécifique
    getBrandingProject: builder.query<BrandingProject, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.BRANDING.PROJECTS}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "BrandingProject", id }],
    }),

    // Mettre à jour un projet
    updateBrandingProject: builder.mutation<
      BrandingProject,
      { id: string; data: Partial<CreateBrandingProjectRequest> }
    >({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.BRANDING.PROJECTS}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "BrandingProject", id }, "BrandingProject"],
    }),

    // Supprimer un projet
    deleteBrandingProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.BRANDING.PROJECTS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BrandingProject"],
    }),

    // Récupérer les logos d'un projet
    getProjectLogos: builder.query<ProjectLogosResponse, string>({
      query: (projectId) => ({
        url: API_ENDPOINTS.BRANDING.PROJECT_LOGOS(projectId),
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [{ type: "ProjectLogos", id: projectId }, "ProjectLogos"],
    }),
  }),
})

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if ((error as FetchBaseQueryError)?.data && typeof (error as FetchBaseQueryError).data === "object") {
    const data = (error as FetchBaseQueryError).data as { message?: string }
    if (data.message) return data.message
  }
  if (error && "message" in error && typeof error.message === "string") {
    return error.message
  }
  return "Une erreur inattendue s'est produite"
}


export const {
  useCreateBrandingProjectMutation,
  useGetBrandingProjectsQuery,
  useGetBrandingProjectQuery,
  useUpdateBrandingProjectMutation,
  useDeleteBrandingProjectMutation,
  useGetProjectLogosQuery,
} = brandingApi
