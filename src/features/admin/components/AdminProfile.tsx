'use client'

import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  UserIcon,
  Shield,
  Crown,
  Key,
  Bell,
  Save,
  Upload,
  Activity,
  Phone,
} from 'lucide-react'

import type { AdminUser, User } from '@/features/admin/types/admin'
import { useGetCurrentUserQuery } from '@/features/dashboard/services/userApi'
import { getToken } from '@/shared/utils/localStorage'

// Types étendus pour les propriétés optionnelles
type ExtendedAdminUser = AdminUser & {
  phone?: string
  username?: string
  companyName?: string
}

type ExtendedApiUser = User & {
  companyName?: string
  phone?: string
}

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
      return 'from-red-500 to-pink-500'
    case 'admin':
      return 'from-blue-500 to-purple-500'
    default:
      return 'from-green-500 to-teal-500'
  }
}
function getRoleIcon(role: RoleType) {
  switch (role) {
    case 'super_admin':
      return Crown
    case 'admin':
      return Shield
    default:
      return UserIcon
  }
}

// Un petit admin par défaut pour l’aperçu si la prop n’est pas fournie
const defaultAdmin: AdminUser = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@domain.com',
  avatar: '/placeholder.svg?height=100&width=100',
  role: 'admin',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  permissions: ['all'],
}

interface AdminProfileProps {
  admin?: AdminUser
}

export function AdminProfile({ admin = defaultAdmin }: AdminProfileProps) {
  const t = useTranslations('admin.profile')
  const tCommon = useTranslations('admin.common')

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
        normalize((apiUser as unknown as ExtendedApiUser)?.phone) ??
        (admin as unknown as ExtendedAdminUser)?.phone,
      username:
        apiUser?.username ?? (admin as unknown as ExtendedAdminUser)?.username,
      companyName:
        (apiUser as unknown as ExtendedApiUser)?.companyName ??
        (admin as unknown as ExtendedAdminUser)?.companyName,
      avatar: admin?.avatar ?? '/placeholder.svg?height=100&width=100',
      role: (admin?.role ?? 'admin') as RoleType,
      createdAt:
        apiUser?.createdAt ?? admin?.createdAt ?? new Date().toISOString(),
      permissions: admin?.permissions ?? ['all'],
    }
  }, [apiUser, admin])

  const [formData, setFormData] = useState({
    name: effective.name,
    email: effective.email,
    phone: effective.phone ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    systemAlerts: true,
    userRegistrations: false,
    criticalErrors: true,
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: effective.name,
      email: effective.email,
      phone: effective.phone ?? '',
    }))
  }, [effective.name, effective.email, effective.phone])

  const RoleIcon = getRoleIcon(effective.role)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: connecter une mutation update pour name/email/phone
    console.log('Profile updated:', formData)
  }
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: connecter une mutation pour changer le mot de passe
    console.log('Password changed')
  }

  if (isLoading && !admin) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-56 bg-slate-200 rounded" />
          <div className="h-4 w-80 bg-slate-200 rounded" />
        </div>
      </div>
    )
  }
  if (isError && !admin) {
    return (
      <div className="p-6">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4 flex items-center justify-between">
          <p>{'Impossible de charger le profil administrateur.'}</p>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 hover:bg-red-700"
          >
            {'Réessayer'}
          </Button>
        </div>
      </div>
    )
  }

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            {t('title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">{t('subtitle')}</p>
          {(effective.companyName || effective.username || effective.phone) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
              {effective.companyName && <span>{effective.companyName}</span>}
              {effective.username && <span>• {effective.username}</span>}
              {effective.phone && (
                <span className="inline-flex items-center gap-1">
                  • <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {effective.phone}
                </span>
              )}
            </div>
          )}
        </div>
        <Badge
          className={`bg-gradient-to-r ${getRoleColor(effective.role)} text-white border-0 text-sm`}
        >
          <RoleIcon className="w-4 h-4 mr-2" />
          {String(effective.role).replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <UserIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                {t('personalInfo')}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                {t('editBasicInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                  <div className="relative">
                    <Avatar className="w-16 sm:w-20 h-16 sm:h-20 ring-4 ring-blue-200">
                      <AvatarImage
                        src={
                          effective.avatar ||
                          '/placeholder.svg?height=100&width=100&query=admin-avatar'
                        }
                        alt={effective.name}
                      />
                      <AvatarFallback
                        className={`bg-gradient-to-r ${getRoleColor(effective.role)} text-white text-lg sm:text-xl`}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                      type="button"
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-600">
                      {effective.name}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base">
                      {effective.email}
                    </p>
                    {effective.phone && (
                      <p className="text-slate-600 text-xs sm:text-sm flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>{effective.phone}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge
                        className={`bg-gradient-to-r ${getRoleColor(effective.role)} text-white border-0 text-xs`}
                      >
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {String(effective.role).replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-600">
                        {t('memberSince')}{' '}
                        {new Date(effective.createdAt).toLocaleDateString(
                          'fr-FR'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-blue-600 text-sm">
                      {t('fullName')}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-blue-600 text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone" className="text-blue-600 text-sm">
                      {t('phone') || 'Téléphone'}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+33 (0)6 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {tCommon('save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Key className="w-4 sm:w-5 h-4 sm:h-5" />
                {t('changePassword')}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                {t('secureAccount')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label
                    htmlFor="currentPassword"
                    className="text-blue-600 text-sm"
                  >
                    {t('currentPassword')}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="newPassword"
                      className="text-blue-600 text-sm"
                    >
                      {t('newPassword')}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-blue-600 text-sm"
                    >
                      {t('confirmPassword')}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="bg-slate-50 border-slate-200 text-slate-900 mt-1 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-sm"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {t('changePassword')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
                {t('notificationPrefs')}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                {t('configureAlerts')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  {
                    key: 'emailAlerts',
                    label: t('emailAlerts'),
                    description: t('emailAlertsDesc'),
                  },
                  {
                    key: 'systemAlerts',
                    label: t('systemAlerts'),
                    description: t('systemAlertsDesc'),
                  },
                  {
                    key: 'userRegistrations',
                    label: t('userRegistrations'),
                    description: t('userRegistrationsDesc'),
                  },
                  {
                    key: 'criticalErrors',
                    label: t('criticalErrors'),
                    description: t('criticalErrorsDesc'),
                  },
                ] as const
              ).map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-blue-600 text-sm">
                      {setting.label}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      {setting.description}
                    </div>
                  </div>
                  <Switch
                    checked={notifications[setting.key]}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        [setting.key]: checked,
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats & Activity */}
        <div className="space-y-6">
          {/* Admin Stats */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 sm:w-5 h-4 sm:h-5" />
                {t('adminStats')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: t('sessionsToday'),
                  value: '12',
                  color: 'text-blue-400',
                },
                {
                  label: t('actionsPerformed'),
                  value: '47',
                  color: 'text-green-400',
                },
                {
                  label: t('usersManaged'),
                  value: '156',
                  color: 'text-purple-400',
                },
                {
                  label: t('connectionTime'),
                  value: '4h 23m',
                  color: 'text-yellow-400',
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-xs sm:text-sm text-slate-700">
                    {stat.label}
                  </span>
                  <span className={`font-semibold ${stat.color} text-sm`}>
                    {stat.value}
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base sm:text-lg">
                <Shield className="w-4 sm:w-5 h-4 sm:h-5" />
                {t('permissions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {effective.permissions.includes('all') ? (
                  <Badge className="bg-green-100 text-green-700 border-green-500 w-full justify-center text-sm">
                    <Crown className="w-3 h-3 mr-1" />
                    {t('fullAccess')}
                  </Badge>
                ) : (
                  effective.permissions.map((permission: string) => (
                    <Badge
                      key={permission}
                      variant="outline"
                      className="text-xs border-slate-300 w-full justify-center"
                    >
                      {permission}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border-blue-200/30">
            <CardHeader>
              <CardTitle className="text-blue-600 text-base sm:text-lg">
                {t('recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: t('userSuspended'), time: 'Il y a 2h' },
                  { action: t('planModified'), time: 'Il y a 4h' },
                  { action: t('feedbackApproved'), time: 'Il y a 6h' },
                  { action: t('adminLogin'), time: 'Il y a 8h' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700 text-xs sm:text-sm truncate">
                      {activity.action}
                    </span>
                    <span className="text-slate-600 text-xs whitespace-nowrap">
                      {activity.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
