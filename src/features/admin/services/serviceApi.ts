import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import type {
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
} from '../types/service'
import { getToken } from '@/shared/utils/localStorage'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const resp = await fetch(url, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(text || `HTTP ${resp.status}`)
  }

  // Some DELETE endpoints may not have a body
  if (resp.status === 204) return undefined as T
  return (await resp.json()) as T
}

export const serviceApi = {
  // GET /service/show
  getServices: async (): Promise<Service[]> => {
    const data = await request<Service[]>(API_ENDPOINTS.SERVICES.LIST, {
      method: 'GET',
    })
    return data
  },

  // POST /service/create
  createService: async (
    data: CreateServiceRequest
  ): Promise<ServiceResponse> => {
    const res = await request<ServiceResponse>(API_ENDPOINTS.SERVICES.CREATE, {
      method: 'POST',
      json: data,
    })
    return res
  },

  // PUT /service/edit/{id}
  updateService: async (
    id: number,
    data: UpdateServiceRequest
  ): Promise<ServiceResponse> => {
    const res = await request<ServiceResponse>(
      API_ENDPOINTS.SERVICES.UPDATE(id),
      { method: 'PUT', json: data }
    )
    return res
  },

  // DELETE /service/delete/{id}
  deleteService: async (id: number): Promise<void> => {
    await request<void>(API_ENDPOINTS.SERVICES.DELETE(id), {
      method: 'DELETE',
    })
  },
}
