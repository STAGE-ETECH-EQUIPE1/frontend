'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  UserIcon,
  Crown,
  Zap,
  Target,
  Calendar,
  Download,
  Heart,
  Palette,
  Settings,
  Upload,
  Save,
  Phone,
} from 'lucide-react'

// Import de votre service RTK Query (adaptez le chemin si nécessaire)
import { useGetCurrentUserQuery } from '../services/userApi'
import SubscriptionCard from './SubscriptionCard'

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

// ———————————————————————————————————————————
// Mock existant (conservé comme base pour les champs non fournis par l’API)
// ———————————————————————————————————————————
const mockUser = {
  id: 'user-1',
  name: 'Sophie Martin',
  username: 'sophie.martin',
  email: 'sophie.martin@email.com',
  phone: '+33 6 12 34 56 78',
  avatar: '/placeholder.svg?height=100&width=100&text=SM',
  status: 'active' as const,
  joinedAt: '2024-01-15T00:00:00Z',
  lastActive: '2024-01-15T00:00:00Z',
  totalLogos: 23,
  totalDownloads: 67,
  tokensUsed: 67,
  plan: {
    id: '1',
    name: 'Pro',
    type: 'premium' as 'gratuit' | 'premium' | 'entreprise',
    price: 29,
    tokens: 100,
    maxTokens: 100 as number | 'unlimited',
    features: [
      '100 logos par mois',
      'Tous formats (PNG, JPG, SVG, PDF)',
      'Support prioritaire',
      'API access',
      'Templates premium',
    ],
    isActive: true,
    subscribersCount: 100,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    renewalDate: '2024-02-15T00:00:00Z',
  },
  stats: {
    totalLogos: 23,
    totalDownloads: 67,
    favoriteLogos: 8,
    commentsGiven: 12,
  },
}

export function UserProfile() {
  const t = useTranslations('userProfile')
  const tCommon = useTranslations('common')

  const {
    data: apiUser,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentUserQuery()

  const [user, setUser] = useState(mockUser)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  })

  useEffect(() => {
    if (!apiUser) return
    setUser((prev) => {
      const displayName = getDisplayName(
        {
          fullName: apiUser.fullName,
          username: apiUser.username,
          email: apiUser.email,
        },
        prev.name
      )
      const safeEmail = normalize(apiUser.email) ?? prev.email
      const safeUsername = normalize(apiUser.username) ?? prev.username
      const safePhone = normalize(apiUser.phone) ?? prev.phone

      return {
        ...prev,
        id: String(apiUser.id),
        name: displayName,
        email: safeEmail,
        username: safeUsername,
        phone: safePhone,
        joinedAt: apiUser.createdAt ?? prev.joinedAt,
        lastActive: apiUser.createdAt ?? prev.lastActive,
      }
    })
    setFormData((prev) => {
      const displayName = getDisplayName(
        {
          fullName: apiUser.fullName,
          username: apiUser.username,
          email: apiUser.email,
        },
        prev.name
      )
      const safeEmail = normalize(apiUser.email) ?? prev.email
      const safePhone = normalize(apiUser.phone) ?? prev.phone
      return {
        ...prev,
        name: displayName,
        email: safeEmail,
        phone: safePhone,
      }
    })
  }, [apiUser])

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
        return 'from-blue-500 to-purple-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const PlanIcon = getPlanIcon(user.plan.type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({ ...user, ...formData })
    console.log('Profile updated:', formData)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-5 w-80 bg-slate-200 rounded" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4 flex items-center justify-between">
          <p>{'Impossible de charger votre profil.'}</p>
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
    user.name && user.name.trim().length > 0
      ? user.name
      : (nameFromEmail(user.email) ?? 'Utilisateur')
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h2>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <Badge
          className={`bg-gradient-to-r ${getPlanColor(user.plan.type)} text-white border-0`}
        >
          <PlanIcon className="w-4 h-4 mr-2" />
          {user.plan.name}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-white border-blue-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                {t('personalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <Avatar className="w-12 sm:w-16 h-12 sm:h-16 ring-4 ring-blue-200">
                      <AvatarImage
                        src={
                          user.avatar ||
                          '/placeholder.svg?height=100&width=100&text=SM'
                        }
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                      type="button"
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-600">
                      {user.name}
                    </h3>
                    <p className="text-slate-600">{user.email}</p>
                    {user.phone && (
                      <p className="text-slate-600 flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{user.phone}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={`bg-gradient-to-r ${getPlanColor(user.plan.type)} text-white border-0`}
                      >
                        <PlanIcon className="w-3 h-3 mr-1" />
                        {user.plan.name}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {t('memberSince')}{' '}
                        {new Date(user.joinedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-blue-600">
                      {t('fullName')}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-blue-600">
                      {t('email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="phone" className="text-blue-600">
                      {t('phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {tCommon('save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Subscription */}
          <SubscriptionCard user={user} />
        </div>

        {/* Stats & Activity */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="bg-white border-blue-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('myStats')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: t('logosCreated'),
                  value: user.stats.totalLogos,
                  icon: Palette,
                  color: 'text-blue-500',
                },
                {
                  label: t('downloads'),
                  value: user.stats.totalDownloads,
                  icon: Download,
                  color: 'text-blue-500',
                },
                {
                  label: t('favorites'),
                  value: user.stats.favoriteLogos,
                  icon: Heart,
                  color: 'text-red-500',
                },
                {
                  label: t('comments'),
                  value: user.stats.commentsGiven,
                  icon: Settings,
                  color: 'text-green-500',
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm text-slate-700">{stat.label}</span>
                  </div>
                  <span className={`font-semibold ${stat.color}`}>
                    {stat.value}
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800">
                {t('recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    action: t('logoCreated'),
                    project: 'TechCorp',
                    time: t('timeAgo.hours', { hours: 2 }),
                  },
                  {
                    action: t('commentAdded'),
                    project: 'Fitness Pro',
                    time: t('timeAgo.days', { days: 1 }),
                  },
                  {
                    action: t('logoDownloaded'),
                    project: 'Restaurant Saveurs',
                    time: t('timeAgo.days', { days: 2 }),
                  },
                  {
                    action: t('favoriteAdded'),
                    project: 'Startup Logo',
                    time: t('timeAgo.days', { days: 3 }),
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <span className="text-slate-700">{activity.action}</span>
                      <p className="text-xs text-slate-500">
                        {activity.project}
                      </p>
                    </div>
                    <span className="text-slate-500">{activity.time}</span>
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
