export interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "super_admin"
  permissions: string[]
  lastLogin: string
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  type: "gratuit" | "premium" | "entreprise"
  price: number
  tokens: number | "unlimited"
  maxTokens: number | "unlimited"
  features: string[]
  isActive: boolean
  subscribersCount: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  status: "active" | "suspended" | "banned"
  plan: Plan
  joinedAt: string
  lastActive: string
  totalLogos: number
  totalDownloads: number
  tokensUsed: number
}

export interface LogoFeedback {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  logoId: string
  logoName: string
  logoUrl?: string
  rating: number
  comment: string
  category: string
  style: string
  status: "pending" | "approved" | "rejected"
  adminResponse?: string
  createdAt: string
}

export interface UsersManagementProps {
  users: User[]
  onUpdateUser: (id: string, updates: Partial<User>) => void
  onDeleteUser: (id: string) => void
  onSendEmail: (userId: string, subject: string, message: string) => void
}

export interface FeedbackManagementProps {
  feedbacks: LogoFeedback[]
  onUpdateFeedback: (id: string, updates: Partial<LogoFeedback>) => void
  onDeleteFeedback: (id: string) => void
  onRespondToFeedback: (id: string, response: string) => void
}
