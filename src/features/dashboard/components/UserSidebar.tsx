'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
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
  UserIcon,
  LogOut,
  Zap,
  Crown,
  Target,
  Sparkles,
  History,
  Type,
  Images,
  FormInput,
} from 'lucide-react'
import { useLogout } from '@/features/auth/hooks/useLogout'

import { useGetCurrentUserQuery } from '../services/userApi'

type PlanType = 'gratuit' | 'premium' | 'entreprise'

interface SidebarUserShape {
  id: string
  name: string
  email: string
  avatar?: string
  plan: {
    name: string
    type: PlanType
    tokensUsed: number
    maxTokens: number | 'unlimited'
  }
}

interface UserSidebarProps {
  user?: SidebarUserShape
  activeTab: string
  setActiveTab: (tab: string) => void
}

function normalize(value?: string | null) {
  const v = (value ?? '').trim()
  return v.length > 0 ? v : undefined
}

function nameFromEmail(email?: string) {
  const e = normalize(email)
  if (!e) return undefined
  const local = e.split('@')[0] || ''
  const pretty = local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return pretty || undefined
}

function getDisplayName(
  src: {
    fullName?: string | null
    username?: string | null
    email?: string | null
  },
  prevName: string
) {
  const full = normalize(src.fullName)
  if (full) return full
  const usern = normalize(src.username)
  if (usern) return usern
  const fromEmail = nameFromEmail(src.email ?? undefined)
  if (fromEmail) return fromEmail
  return prevName || 'Utilisateur'
}

export function UserSidebar({
  user: userProp,
  activeTab,
  setActiveTab,
}: UserSidebarProps) {
  const t = useTranslations()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const logout = useLogout(userProp?.id)

  const {
    data: apiUser,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentUserQuery()

  const navigationItems = [
    {
      title: t('navigation.profile'),
      icon: UserIcon,
      value: 'profile',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.projects'),
      icon: UserIcon,
      value: 'projects',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.history'),
      icon: History,
      value: 'history',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.fileToProvide'),
      icon: FormInput,
      value: 'file-to-provide',
      color: 'text-blue-600',
    },
  ]

  const visualIdentityNavigationItems = [
    {
      title: t('navigation.visualIdentity.colorPaletteGeneration'),
      icon: Palette,
      value: 'color-palette-generation',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.visualIdentity.typographieGeneration'),
      icon: Type,
      value: 'typographie-generation',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.visualIdentity.logoGeneration'),
      icon: Images,
      value: 'logo-generation',
      color: 'text-blue-600',
    },
  ]

  const verbalIdentityNavigationItems = [
    {
      title: t('navigation.verbalIdentity.companyNameGeneration'),
      icon: Images,
      value: 'companyName-generation',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.verbalIdentity.companySloganGeneration'),
      icon: Images,
      value: 'companySlogan-generation',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.verbalIdentity.companyValueGeneration'),
      icon: Images,
      value: 'companyValues-generation',
      color: 'text-blue-600',
    },
    {
      title: t('navigation.verbalIdentity.companyToneOfVoiceGeneration'),
      icon: Images,
      value: 'companyToneOfVoice-generation',
      color: 'text-blue-600',
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

  // Plan de base si non fourni via props
  const fallbackPlan: SidebarUserShape['plan'] = {
    name: 'Pro',
    type: 'premium',
    tokensUsed: 67,
    maxTokens: 100,
  }

  // Fusion props + API (API hydrate name/email; plan provient des props sinon fallback)
  const effectiveUser: SidebarUserShape = {
    id: String(apiUser?.id ?? userProp?.id ?? 'user-1'),
    name: getDisplayName(
      {
        fullName: apiUser?.fullName,
        username: apiUser?.username,
        email: apiUser?.email,
      },
      userProp?.name ?? 'Utilisateur'
    ),
    email: normalize(apiUser?.email) ?? userProp?.email ?? '',
    avatar: userProp?.avatar ?? '/placeholder.svg?height=100&width=100&text=U',
    plan: userProp?.plan ?? fallbackPlan,
  }

  const PlanIcon = getPlanIcon(effectiveUser.plan.type)
  const tokensUsed = effectiveUser.plan.tokensUsed
  const maxTokens = effectiveUser.plan.maxTokens
  const tokensPercentage =
    maxTokens === 'unlimited' ? 0 : (tokensUsed / (maxTokens as number)) * 100

  const initials = (
    effectiveUser.name && effectiveUser.name.trim().length > 0
      ? effectiveUser.name
      : (nameFromEmail(effectiveUser.email) ?? 'Utilisateur')
  )
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <Sidebar className="border-r  border-blue-200 bg-white backdrop-blur-xl shadow-lg">
      <SidebarHeader className="p-4 bg-white sm:p-6 border-b border-blue-100">
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
                {t('dashboard.title')}
              </h1>
              <p className="text-xs text-slate-500">
                {t('userSidebar.logoCreator')}
              </p>
            </div>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-3 bg-white sm:px-4">
        {/* User Profile Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-blue-100 mt-4 sm:mb-6 shadow-sm"
            >
              {/* Loading / Error messages intégrés dans le bloc profil */}
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <Avatar className="w-8 sm:w-10 h-8 sm:h-10 ring-2 ring-blue-200">
                      <AvatarImage
                        src={effectiveUser.avatar || '/placeholder.svg'}
                        alt={effectiveUser.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-slate-800">
                          {effectiveUser.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs bg-gradient-to-r ${getPlanColor(
                              effectiveUser.plan.type
                            )} text-white border-0`}
                          >
                            <PlanIcon className="w-3 h-3 mr-1" />
                            {effectiveUser.plan.name}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{t('dashboard.tokensUsed')}</span>
                        <span>
                          {tokensUsed}/
                          {maxTokens === 'unlimited'
                            ? '∞'
                            : (maxTokens as number)}
                        </span>
                      </div>
                      {maxTokens !== 'unlimited' && (
                        <Progress value={tokensPercentage} className="h-2" />
                      )}

                      {isError && (
                        <div className="mt-2 text-[11px] text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1 flex items-center justify-between">
                          <span>{'Impossible de charger votre profil.'}</span>
                          <button
                            onClick={() => refetch()}
                            className="underline hover:text-red-700"
                          >
                            {'Réessayer'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-2">
            {t('navigation.statistics')}
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

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-2">
            {t('navigation.visualIdentity.visualIdentity')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visualIdentityNavigationItems.map((item, index) => (
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

        {/* Navigation : Verbal Identity*/}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-2">
            {t('navigation.verbalIdentity.verbalIdentity')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {verbalIdentityNavigationItems.map((item, index) => (
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
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 border-t border-blue-100 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="group text-red-500 hover:bg-red-50 transition-all duration-300"
              tooltip={isCollapsed ? t('navigation.logout') : undefined}
              onClick={logout}
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              {!isCollapsed && (
                <span className="text-sm">{t('navigation.logout')}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
