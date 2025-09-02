export interface Service {
  id: number
  name: string
  price: string
  token?: number
  tokens?: number
  createdAt?: string
}

export interface Pack {
  id: number
  name: string
  price: string
  startedAt: string
  expiredAt: string
  services: Record<string, Service> | number[]
  createdAt?: string
  updatedAt?: string
}

export interface CreatePackFormData {
  name: string
  price: number
  startedAt: string
  expiredAt: string
  services: number[]
}

export interface PackResponse {
  message: string
  pack: Pack
}
