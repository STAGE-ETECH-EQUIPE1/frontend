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
} from 'lucide-react'
import type { AdminUser } from '@/types/admin'

interface AdminSidebarProps {
  admin: AdminUser
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({
  admin,
  activeTab,
  setActiveTab,
}: AdminSidebarProps) {
  const t = useTranslations('admin')
  const tSidebar = useTranslations('admin.sidebar')
  const tCommon = useTranslations('admin.common')
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const navigationItems = [
    {
      title: tSidebar('navigation'),
      icon: LayoutDashboard,
      value: 'dashboard',
      color: 'text-blue-600',
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500'
      case 'admin':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500'
      default:
        return 'bg-gradient-to-r from-green-500 to-teal-500'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return Crown
      case 'admin':
        return Shield
      default:
        return Activity
    }
  }

  const RoleIcon = getRoleIcon(admin.role)

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
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <Avatar className="w-8 sm:w-10 h-8 sm:h-10 ring-2 ring-blue-200">
                  <AvatarImage
                    src={admin.avatar || '/placeholder.svg'}
                    alt={admin.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm">
                    {admin.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-slate-800">
                      {admin.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs ${getRoleColor(admin.role)} text-white border-0`}
                      >
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {admin.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>{tSidebar('lastLogin')}</span>
                    <span>
                      {new Date(admin.lastLogin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
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
              onClick={() => setActiveTab('profile')}
              className={`group transition-all duration-300 ${
                activeTab === 'profile'
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
