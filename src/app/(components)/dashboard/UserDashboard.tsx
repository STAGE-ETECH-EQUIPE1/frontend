'use client'

import { useState } from 'react'
import { UserSidebar } from './UserSidebar'
import { LogoGenerator } from './LogoGenerator'
import { ProjectsManager } from './ProjectsManager'
import { UserProfile } from './UserProfile'
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
import { GenerationHistory } from './GenerationHistory'

// Mock user data
const mockUser = {
  id: 'user-1',
  name: 'Sophie Martin',
  email: 'sophie.martin@email.com',
  avatar: '/placeholder.svg?height=100&width=100&text=SM',
  joinedAt: '2024-01-15T00:00:00Z',
  plan: {
    name: 'Pro',
    type: 'premium' as const,
    price: 29,
    tokensUsed: 67,
    maxTokens: 100,
    features: [
      '100 logos par mois',
      'Tous formats (PNG, JPG, SVG, PDF)',
      'Support prioritaire',
      'API access',
      'Templates premium',
    ],
    renewalDate: '2024-02-15T00:00:00Z',
  },
  stats: {
    totalLogos: 23,
    totalDownloads: 67,
    favoriteLogos: 8,
    commentsGiven: 12,
  },
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('generate')

  const getBreadcrumbTitle = (tab: string) => {
    switch (tab) {
      case 'generate':
        return 'Générer un Logo'
      case 'projects':
        return 'Mes Projets'
      case 'profile':
        return 'Mon Profil'
      case 'settings':
        return 'Paramètres'
      default:
        return 'Dashboard'
      case 'history':
        return 'History'
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'generate':
        return <LogoGenerator user={mockUser} />
      case 'projects':
        return <ProjectsManager />
      case 'profile':
        return <UserProfile />
      case 'history':
        return <GenerationHistory />
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Paramètres
              </h3>
              <p className="text-slate-600">
                Cette section sera bientôt disponible
              </p>
            </div>
          </div>
        )
      default:
        return <LogoGenerator user={mockUser} />
    }
  }

  return (
    <SidebarProvider>
      <UserSidebar
        user={mockUser}
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
                  ORBIXUP
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
