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
  onCreateService: (service: Omit<Service, "id" | "createdAt" | "updatedAt" | "usageCount">) => void
  onUpdateService: (id: string, updates: Partial<Service>) => void
  onDeleteService: (id: string) => void
}
