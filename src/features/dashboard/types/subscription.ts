export interface CreateSubscriptionRequest {
  name: string
  reference: string
  status: "active" | "inactive" | "pending"
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
  status: "active" | "inactive" | "pending"
  startedAt: string
  endedAt: string
  paymentId: number
  services: number[]
  clientId: number
  createdAt: string
  updatedAt: string
}