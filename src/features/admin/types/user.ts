export interface User {
  id: number
  email: string
  roles: string[]
  fullName: string
  username: string
  phone: string
  subscriptions: []
  packName: []
}

export interface UsersManagementProps {
  users: User[]
  onUpdateUser: (userId: string, updates: Partial<User>) => void
  onDeleteUser: (userId: string) => void
  onSendEmail: (userId: string, subject: string, message: string) => void
}
