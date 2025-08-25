'use client'

import { useMemo, useState } from 'react'
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
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Settings,
  Shield,
  Activity,
  LogOut,
  Crown,
  Wrench,
} from 'lucide-react'
import type { AdminUser } from '@/features/admin/types/admin'

// Types étendus pour les propriétés optionnelles
type ExtendedAdminUser = AdminUser & {
  phone?: string
  lastLogin?: string
}

import { useLogout } from '@/features/auth/hooks/useLogout'
import { useGetCurrentUserQuery } from '@/features/dashboard/services/userApi'
import { getToken } from '@/shared/utils/localStorage'

type RoleType = 'super_admin' | 'admin' | 'manager' | string

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
  fallback: string
) {
  const full = normalize(src.fullName)
  if (full) return full
  const usern = normalize(src.username)
  if (usern) return usern
  const fromEmail = nameFromEmail(src.email ?? undefined)
  if (fromEmail) return fromEmail
  return fallback || 'Utilisateur'
}
function getRoleColor(role: RoleType) {
  switch (role) {
    case 'super_admin':
      return 'bg-gradient-to-r from-red-500 to-pink-500'
    case 'admin':
      return 'bg-gradient-to-r from-blue-500 to-indigo-500'
    default:
      return 'bg-gradient-to-r from-green-500 to-teal-500'
  }
}
function getRoleIcon(role: RoleType) {
  switch (role) {
    case 'super_admin':
      return Crown
    case 'admin':
      return Shield
    default:
      return Activity
  }
}

const defaultAdmin: AdminUser = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@domain.com',
  avatar: '/placeholder.svg?height=100&width=100',
  role: 'admin',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  permissions: ['all'],
}

interface AdminSidebarProps {
  admin?: AdminUser
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

export function AdminSidebar({
  admin = defaultAdmin,
  activeTab,
  setActiveTab,
}: AdminSidebarProps) {
  const t = useTranslations('admin')
  const tSidebar = useTranslations('admin.sidebar')
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // Non-controlled fallback
  const [internalTab, setInternalTab] = useState<string>(
    activeTab ?? 'dashboard'
  )
  const controlled =
    typeof activeTab !== 'undefined' && typeof setActiveTab === 'function'
  const currentTab = controlled ? (activeTab as string) : internalTab
  const setTab = controlled
    ? (setActiveTab as (tab: string) => void)
    : setInternalTab

  const navigationItems = [
    {
      title: tSidebar('navigation'),
      icon: LayoutDashboard,
      value: 'dashboard',
      color: 'text-blue-600',
    },
    {
      title: tSidebar('services'),
      icon: Wrench,
      value: 'services',
      color: 'text-emerald-600',
    },
    {
      title: tSidebar('plans'),
      icon: Package,
      value: 'plans',
      color: 'text-indigo-600',
    },
    {
      title: tSidebar('users'),
      icon: Users,
      value: 'users',
      color: 'text-purple-600',
    },
    {
      title: tSidebar('feedback'),
      icon: MessageSquare,
      value: 'feedback',
      color: 'text-amber-600',
    },
  ]

  const token = typeof window !== 'undefined' ? getToken() : null
  const {
    data: apiUser,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const effective = useMemo(() => {
    const name = getDisplayName(
      {
        fullName: apiUser?.fullName,
        username: apiUser?.username,
        email: apiUser?.email,
      },
      admin?.name ?? 'Utilisateur'
    )
    return {
      id: String(apiUser?.id ?? admin?.id ?? 'admin-1'),
      name,
      email: normalize(apiUser?.email) ?? admin?.email ?? '',
      phone:
        normalize((apiUser as unknown as { phone?: string })?.phone) ??
        (admin as unknown as ExtendedAdminUser)?.phone,
      avatar: admin?.avatar ?? '/placeholder.svg?height=100&width=100',
      role: (admin?.role ?? 'admin') as RoleType,
      lastLogin:
        (admin as unknown as ExtendedAdminUser)?.lastLogin ??
        new Date().toISOString(),
    }
  }, [apiUser, admin])

  const RoleIcon = getRoleIcon(effective.role)
  const initials = (
    effective.name && effective.name.trim().length > 0
      ? effective.name
      : (nameFromEmail(effective.email) ?? 'U')
  )
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

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
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('title').toUpperCase()}
              </h1>
              <p className="text-xs text-slate-500">{t('panel')}</p>
            </div>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-3 sm:px-4">
        {/* Admin Profile Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-4 sm:mb-6 shadow-sm"
            >
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
                        src={effective.avatar || '/placeholder.svg'}
                        alt={effective.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-slate-800">
                          {effective.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${getRoleColor(effective.role)} text-white border-0`}
                          >
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {String(effective.role)
                              .replace('_', ' ')
                              .toUpperCase()}
                          </Badge>
                        </div>
                        {/* Ligne d’infos supplémentaires */}
                        {(effective.phone || effective.email) && (
                          <p className="text-[11px] text-slate-600 mt-1 truncate">
                            {effective.phone ?? effective.email}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>{tSidebar('lastLogin')}</span>
                        <span>
                          {new Date(effective.lastLogin).toLocaleDateString(
                            'fr-FR'
                          )}
                        </span>
                      </div>

                      {isError && (
                        <div className="mt-2 text-[11px] text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1 flex items-center justify-between">
                          <span>{'Impossible de charger le profil.'}</span>
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
            {tSidebar('navigation')}
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
                      onClick={() => setTab(item.value)}
                      className={`group relative transition-all duration-300 ${
                        currentTab === item.value
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
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Status */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-2">
              {tSidebar('system')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-2"
              >
                {[
                  {
                    name: tSidebar('api'),
                    status: 'online',
                    color: 'text-green-500',
                  },
                  {
                    name: tSidebar('database'),
                    status: 'online',
                    color: 'text-green-500',
                  },
                  {
                    name: tSidebar('ai'),
                    status: 'warning',
                    color: 'text-amber-500',
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                  >
                    <span className="text-xs text-slate-600">
                      {service.name}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${service.color.replace('text-', 'bg-')} animate-pulse`}
                    />
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
              onClick={() => setTab('profile')}
              className={`group transition-all duration-300 ${
                currentTab === 'profile'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
              }`}
              tooltip={isCollapsed ? tSidebar('myProfile') : undefined}
            >
              <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              {!isCollapsed && (
                <span className="text-sm">{tSidebar('myProfile')}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="group text-red-500 hover:bg-red-50 transition-all duration-300"
              tooltip={isCollapsed ? tSidebar('logout') : undefined}
              onClick={useLogout()}
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              {!isCollapsed && (
                <span className="text-sm">{tSidebar('logout')}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
