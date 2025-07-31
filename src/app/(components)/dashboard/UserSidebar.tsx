'use client'

import { motion } from 'framer-motion'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Palette,
  User,
  FolderOpen,
  Settings,
  LogOut,
  Zap,
  Crown,
  Target,
  Sparkles,
  History,
} from 'lucide-react'

interface UserSidebarProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    plan: {
      name: string
      type: 'gratuit' | 'premium' | 'entreprise'
      tokensUsed: number
      maxTokens: number | 'unlimited'
    }
  }
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function UserSidebar({
  user,
  activeTab,
  setActiveTab,
}: UserSidebarProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const navigationItems = [
    {
      title: 'Générer un Logo',
      icon: Palette,
      value: 'generate',
      color: 'text-blue-600',
    },
    {
      title: 'Historique',
      icon: History,
      value: 'history',
      color: 'text-blue-600',
    },
    {
      title: 'Mes Projets',
      icon: FolderOpen,
      value: 'projects',
      color: 'text-blue-600',
    },
    {
      title: 'Mon Profil',
      icon: User,
      value: 'profile',
      color: 'text-blue-600',
    },
    {
      title: 'Paramètres',
      icon: Settings,
      value: 'settings',
      color: 'text-slate-600',
    },
  ]

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'entreprise':
        return Crown
      case 'premium':
        return Zap
      default:
        return Target
    }
  }

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'entreprise':
        return 'from-yellow-400 to-orange-500'
      case 'premium':
        return 'from-blue-500 to-blue-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const PlanIcon = getPlanIcon(user.plan.type)
  const tokensUsed = user.plan.tokensUsed
  const maxTokens = user.plan.maxTokens
  const tokensPercentage =
    maxTokens === 'unlimited' ? 0 : (tokensUsed / (maxTokens as number)) * 100

  return (
    <Sidebar className="border-r border-blue-200 bg-white backdrop-blur-xl shadow-lg">
      <SidebarHeader className="p-4 sm:p-6 border-b border-blue-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Palette className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ORBIXUP
              </h1>
              <p className="text-xs text-slate-500">Créateur de Logos</p>
            </div>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-3 sm:px-4">
        {/* User Profile Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-blue-100 mb-4 sm:mb-6 shadow-sm"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <Avatar className="w-8 sm:w-10 h-8 sm:h-10 ring-2 ring-blue-200">
                  <AvatarImage
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-slate-800">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs bg-gradient-to-r ${getPlanColor(user.plan.type)} text-white border-0`}
                      >
                        <PlanIcon className="w-3 h-3 mr-1" />
                        {user.plan.name}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Tokens utilisés</span>
                    <span>
                      {tokensUsed}/{maxTokens === 'unlimited' ? '∞' : maxTokens}
                    </span>
                  </div>
                  {maxTokens !== 'unlimited' && (
                    <Progress value={tokensPercentage} className="h-2" />
                  )}
                </div>
              )}
            </motion.div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.value)}
                      className={`group relative transition-all duration-300 ${
                        activeTab === item.value
                          ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500 shadow-sm'
                          : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'
                      }`}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <item.icon
                        className={`w-4 sm:w-5 h-4 sm:h-5 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">
                          {item.title}
                        </span>
                      )}
                      {activeTab === item.value && (
                        <Sparkles className="w-4 h-4 text-blue-500 ml-auto animate-pulse" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-2">
              Statistiques
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-2"
              >
                {[
                  { label: 'Logos créés', value: '12', color: 'text-blue-500' },
                  {
                    label: 'Téléchargements',
                    value: '34',
                    color: 'text-blue-500',
                  },
                  { label: 'Favoris', value: '8', color: 'text-pink-500' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                  >
                    <span className="text-xs text-slate-600">{stat.label}</span>
                    <span className={`font-semibold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 border-t border-blue-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="group text-red-500 hover:bg-red-50 transition-all duration-300"
              tooltip={isCollapsed ? 'Déconnexion' : undefined}
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              {!isCollapsed && <span className="text-sm">Déconnexion</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
