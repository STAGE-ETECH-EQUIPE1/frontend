export interface Service {
  id: string
  name: string
  price: number
  tokens: number
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface ServicesManagementProps {
  services: Service[]
  onCreateService: (
    service: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
  ) => void
  onUpdateService: (id: string, updates: Partial<Service>) => void
  onDeleteService: (id: string) => void
}

export interface PackResponse {
  id: number
  name: string
  price: string
  createdAt: string
  startedAt: string
  expiredAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}