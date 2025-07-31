'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminDashboard } from './AdminDashboard'
import { PlansManagement } from './PlansManagement'
import { AdminProfile } from './AdminProfile'
import type { AdminUser, Plan, User, LogoFeedback } from '@/types/admin'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Import the new components
import { UsersManagement } from './UsersManagement'
import { FeedbackManagement } from './LogoFeedbackManagement'

// Mock data pour la démo
const mockAdmin: AdminUser = {
  id: 'admin-1',
  name: 'Alexandre Martin',
  email: 'admin@orbixup.com',
  avatar: '/placeholder.svg?height=100&width=100&text=AM',
  role: 'super_admin',
  permissions: ['all'],
  lastLogin: new Date().toISOString(),
  createdAt: '2024-01-01T00:00:00Z',
}

const mockPlans: Plan[] = [
  {
    id: 'plan-1',
    name: 'Starter',
    type: 'gratuit',
    price: 0,
    tokens: 10,
    maxTokens: 10,
    features: ['10 logos par mois', 'Formats PNG/JPG', 'Support email'],
    isActive: true,
    subscribersCount: 1247,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'plan-2',
    name: 'Pro',
    type: 'premium',
    price: 29,
    tokens: 100,
    maxTokens: 100,
    features: [
      '100 logos par mois',
      'Tous formats',
      'Support prioritaire',
      'API access',
    ],
    isActive: true,
    subscribersCount: 456,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'plan-3',
    name: 'Enterprise',
    type: 'entreprise',
    price: 99,
    tokens: 'unlimited',
    maxTokens: 'unlimited',
    features: [
      'Logos illimités',
      'Tous formats',
      'Support 24/7',
      'API access',
      'White-label',
    ],
    isActive: true,
    subscribersCount: 89,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Add more mock users data
const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'startup_ceo',
    email: 'ceo@startup.com',
    avatar: '/placeholder.svg?height=40&width=40&text=SC',
    status: 'active',
    plan: mockPlans[1],
    joinedAt: '2024-01-15T00:00:00Z',
    lastActive: '2024-01-30T14:32:00Z',
    totalLogos: 45,
    totalDownloads: 123,
    tokensUsed: 67,
  },
  {
    id: 'user-2',
    username: 'design_studio',
    email: 'hello@designstudio.com',
    avatar: '/placeholder.svg?height=40&width=40&text=DS',
    status: 'active',
    plan: mockPlans[2],
    joinedAt: '2024-01-10T00:00:00Z',
    lastActive: '2024-01-30T12:15:00Z',
    totalLogos: 156,
    totalDownloads: 445,
    tokensUsed: 234,
  },
  {
    id: 'user-3',
    username: 'freelancer_pro',
    email: 'pro@freelance.com',
    avatar: '/placeholder.svg?height=40&width=40&text=FP',
    status: 'suspended',
    plan: mockPlans[0],
    joinedAt: '2024-01-20T00:00:00Z',
    lastActive: '2024-01-28T09:45:00Z',
    totalLogos: 12,
    totalDownloads: 34,
    tokensUsed: 8,
  },
  {
    id: 'user-4',
    username: 'marketing_agency',
    email: 'contact@agency.com',
    avatar: '/placeholder.svg?height=40&width=40&text=MA',
    status: 'active',
    plan: mockPlans[1],
    joinedAt: '2024-01-05T00:00:00Z',
    lastActive: '2024-01-30T16:20:00Z',
    totalLogos: 89,
    totalDownloads: 267,
    tokensUsed: 78,
  },
  {
    id: 'user-5',
    username: 'tech_startup',
    email: 'founder@techstartup.io',
    avatar: '/placeholder.svg?height=40&width=40&text=TS',
    status: 'banned',
    plan: mockPlans[0],
    joinedAt: '2024-01-25T00:00:00Z',
    lastActive: '2024-01-26T11:30:00Z',
    totalLogos: 3,
    totalDownloads: 5,
    tokensUsed: 3,
  },
]

// Add more mock feedbacks data
const mockFeedbacks: LogoFeedback[] = [
  {
    id: 'feedback-1',
    userId: 'user-1',
    userName: 'startup_ceo',
    userAvatar: '/placeholder.svg?height=40&width=40&text=SC',
    logoId: 'logo-1',
    logoName: 'TechCorp Logo',
    logoUrl: '/placeholder.svg?height=200&width=200&text=Logo1',
    rating: 5,
    comment:
      'Excellent logo ! Exactement ce que je cherchais pour ma startup tech.',
    category: 'Technology',
    style: 'Modern',
    status: 'approved',
    adminResponse: 'Merci pour votre retour positif !',
    createdAt: '2024-01-29T10:30:00Z',
  },
  {
    id: 'feedback-2',
    userId: 'user-2',
    userName: 'design_studio',
    userAvatar: '/placeholder.svg?height=40&width=40&text=DS',
    logoId: 'logo-2',
    logoName: 'Creative Agency Brand',
    logoUrl: '/placeholder.svg?height=200&width=200&text=Logo2',
    rating: 4,
    comment:
      'Très bon travail, quelques ajustements mineurs seraient parfaits.',
    category: 'Design',
    style: 'Creative',
    status: 'pending',
    createdAt: '2024-01-30T08:15:00Z',
  },
  {
    id: 'feedback-3',
    userId: 'user-3',
    userName: 'freelancer_pro',
    userAvatar: '/placeholder.svg?height=40&width=40&text=FP',
    logoId: 'logo-3',
    logoName: 'Freelance Logo',
    logoUrl: '/placeholder.svg?height=200&width=200&text=Logo3',
    rating: 2,
    comment:
      'Le logo ne correspond pas vraiment à mes attentes. Trop générique.',
    category: 'Business',
    style: 'Professional',
    status: 'rejected',
    adminResponse:
      'Nous prenons note de vos commentaires pour améliorer nos algorithmes.',
    createdAt: '2024-01-28T14:45:00Z',
  },
  {
    id: 'feedback-4',
    userId: 'user-4',
    userName: 'marketing_agency',
    userAvatar: '/placeholder.svg?height=40&width=40&text=MA',
    logoId: 'logo-4',
    logoName: 'Agency Power Logo',
    logoUrl: '/placeholder.svg?height=200&width=200&text=Logo4',
    rating: 5,
    comment:
      'Parfait pour notre agence ! Le style moderne et les couleurs sont top.',
    category: 'Marketing',
    style: 'Modern',
    status: 'approved',
    adminResponse: 'Ravi que le logo vous plaise !',
    createdAt: '2024-01-30T11:20:00Z',
  },
  {
    id: 'feedback-5',
    userId: 'user-1',
    userName: 'startup_ceo',
    userAvatar: '/placeholder.svg?height=40&width=40&text=SC',
    logoId: 'logo-5',
    logoName: 'Innovation Hub',
    logoUrl: '/placeholder.svg?height=200&width=200&text=Logo5',
    rating: 3,
    comment:
      "Correct mais manque d'originalité. J'espérais quelque chose de plus unique.",
    category: 'Technology',
    style: 'Minimalist',
    status: 'pending',
    createdAt: '2024-01-30T13:10:00Z',
  },
]

// Add handler functions
const handleSendEmail = (userId: string, subject: string, message: string) => {
  console.log('Sending email to user:', userId, { subject, message })
}

const handleRespondToFeedback = (id: string, response: string) => {
  console.log('Responding to feedback:', id, response)
}

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [feedbacks, setFeedbacks] = useState<LogoFeedback[]>(mockFeedbacks)

  // Mettre à jour les handlers pour utiliser les états
  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
    )
    console.log('Updating user:', id, updates)
  }

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
    console.log('Deleting user:', id)
  }

  const handleUpdateFeedback = (id: string, updates: Partial<LogoFeedback>) => {
    setFeedbacks((prev) =>
      prev.map((feedback) =>
        feedback.id === id ? { ...feedback, ...updates } : feedback
      )
    )
    console.log('Updating feedback:', id, updates)
  }

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id))
    console.log('Deleting feedback:', id)
  }

  const handleCreatePlan = (
    plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt' | 'subscribersCount'>
  ) => {
    console.log('Creating plan:', plan)
  }

  const handleUpdatePlan = (id: string, updates: Partial<Plan>) => {
    console.log('Updating plan:', id, updates)
  }

  const handleDeletePlan = (id: string) => {
    console.log('Deleting plan:', id)
  }

  const getBreadcrumbTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard'
      case 'plans':
        return 'Plans'
      case 'users':
        return 'Utilisateurs'
      case 'feedback':
        return 'Commentaires'
      case 'profile':
        return 'Mon Profil'
      default:
        return 'Dashboard'
    }
  }

  // Mettre à jour renderContent pour utiliser les états
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            users={users}
            plans={mockPlans}
            feedbacks={feedbacks}
          />
        )
      case 'plans':
        return (
          <PlansManagement
            plans={mockPlans}
            onCreatePlan={handleCreatePlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
          />
        )
      case 'users':
        return (
          <UsersManagement
            users={users}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onSendEmail={handleSendEmail}
          />
        )
      case 'feedback':
        return (
          <FeedbackManagement
            feedbacks={feedbacks}
            onUpdateFeedback={handleUpdateFeedback}
            onDeleteFeedback={handleDeleteFeedback}
            onRespondToFeedback={handleRespondToFeedback}
          />
        )
      case 'profile':
        return <AdminProfile admin={mockAdmin} />
      default:
        return (
          <AdminDashboard
            users={users}
            plans={mockPlans}
            feedbacks={feedbacks}
          />
        )
    }
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        admin={mockAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sm:px-6 bg-white/95 backdrop-blur-xl">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-blue-600">
                  ADMIN
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-800 text-sm sm:text-base">
                  {getBreadcrumbTitle(activeTab)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white p-4 sm:p-6">
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
