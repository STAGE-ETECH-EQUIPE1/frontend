export interface Service {
  id: number
  name: string
  price: number
  token?: number
  description?: string
  isActive?: boolean
  usageCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateServiceRequest {
  name: string
  price: number
  token: number
}

export interface UpdateServiceRequest {
  name: string
  price: number
  token: number
}

export interface ServiceResponse {
  message?: string
  service?: Service
}

export interface ServicesManagementProps {
  services: Service[]
  onCreateService: (data: CreateServiceRequest) => void
  onUpdateService: (id: number, data: UpdateServiceRequest) => void
  onDeleteService: (id: number) => void
}
