export interface Logo {
  id: number
  projectId: number
  url: string
  name: string
  createdAt: string
  approved: boolean
}

export interface GenerationHistoryResponse {
  logos: Logo[]
  total: number
  page: number
  size: number
  totalPages: number
}

export interface GenerationHistoryParams {
  id: number
  size?: number
  page?: number
}
