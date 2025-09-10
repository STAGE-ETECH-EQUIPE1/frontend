import { PackResponse } from '@/types/service'

export interface CreateSubscriptionRequest {
  name: string
  reference: string
  status: 'active' | 'inactive' | 'pending'
  startedAt: string
  endedAt: string
  paymentId: number
  services: number[]
  clientId: number
}

export interface Subscription {
  id: number
  name: string
  reference: string
  status: 'active' | 'inactive' | 'pending'
  startedAt: string
  endedAt: string
  paymentId: number
  services: number[]
  clientId: number
  createdAt: string
  updatedAt: string
}

export interface ServiceResponse {
  id: number
  name: string
  price: string
  token: number
}

export interface SubscriptionResponse {
  id: number
  name: string
  reference: string
  status: 'active' | 'inactive' | 'pending'
  startedAt: string
  endedAt: string
  paymentId: number
  clientId: number
  createdAt: string
  updatedAt: string
  pack: PackResponse
  services: Array<ServiceResponse>
}
