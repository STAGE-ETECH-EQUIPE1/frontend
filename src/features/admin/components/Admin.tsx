'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminSidebar } from './AdminSidebar'
import { PacksManagement } from './PacksManagement'
import { AdminProfile } from './AdminProfile'
import type { AdminUser, LogoFeedback } from '@/features/admin/types/admin'
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
import { FeedbackManagement } from './LogoFeedbackManagement'
import LanguageSwitcher from '../../../shared/components/translation/LanguageSwitcher'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import LoadingAnimation from '@/shared/components/loading/LoadingAnimation'
import ServicesPage from './ServicePage'
import { UsersManagementContainer } from './UsersManagementContainer'

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

const handleRespondToFeedback = (id: string, response: string) => {
  console.log('Responding to feedback:', id, response)
}

export function AdminPage() {
  const t = useTranslations('admin')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [feedbacks, setFeedbacks] = useState<LogoFeedback[]>(mockFeedbacks)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !user.roles.includes('ROLE_ADMIN'))) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <>
        <LoadingAnimation />
      </>
    )
  }
  if (!user || !user.roles.includes('ROLE_ADMIN')) {
    return null
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

  const getBreadcrumbTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return t('sidebar.navigation')
      case 'plans':
        return t('sidebar.plans')
      case 'users':
        return t('sidebar.users')
      case 'feedback':
        return t('sidebar.feedback')
      case 'profile':
        return t('profile.title')
      default:
        return t('sidebar.navigation')
    }
  }

  // Mettre à jour renderContent pour utiliser les états
  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesPage />
      case 'plans':
        return <PacksManagement />
      case 'users':
        return <UsersManagementContainer />
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
        return <ServicesPage />
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
                  {t('title').toUpperCase()}
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
          <LanguageSwitcher />
        </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white p-4 sm:p-6">
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
