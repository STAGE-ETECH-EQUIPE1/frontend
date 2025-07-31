'use client'

import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  User,
  Crown,
  Zap,
  Target,
  Calendar,
  Download,
  Heart,
  Palette,
  CreditCard,
  Settings,
  Upload,
  Save,
} from 'lucide-react'

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    joinedAt: string
    plan: {
      name: string
      type: 'gratuit' | 'premium' | 'entreprise'
      price: number
      tokensUsed: number
      maxTokens: number | 'unlimited'
      features: string[]
      renewalDate: string
    }
    stats: {
      totalLogos: number
      totalDownloads: number
      favoriteLogos: number
      commentsGiven: number
    }
  }
}

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

const plans = [
  {
    name: 'starter',
    type: 'gratuit' as const,
    price: 0,
    tokens: 10,
    popular: false,
    featureCount: 3,
  },
  {
    name: 'pro',
    type: 'premium' as const,
    price: 29,
    tokens: 100,
    popular: true,
    featureCount: 5,
  },
  {
    name: 'enterprise',
    type: 'entreprise' as const,
    price: 99,
    tokens: 'unlimited' as const,
    popular: false,
    featureCount: 6,
  },
]

export function UserProfile() {
  const t = useTranslations('userProfile')
  const tCommon = useTranslations('common')
  const [user, setUser] = useState(mockUser)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  })
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)

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

  const getPlanFeatures = (planName: string, featureCount: number) => {
    const features = []
    for (let i = 1; i <= featureCount; i++) {
      const featureKey = `planFeatures.${planName}.feature${i}`
      features.push(t(featureKey))
    }
    return features
  }

  const PlanIcon = getPlanIcon(user.plan.type)
  const tokensPercentage =
    user.plan.maxTokens === 'unlimited'
      ? 0
      : (user.plan.tokensUsed / (user.plan.maxTokens as number)) * 100

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({ ...user, ...formData })
    console.log('Profile updated:', formData)
  }

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
                <User className="w-5 h-5" />
                {t('personalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <Avatar className="w-12 sm:w-16 h-12 sm:h-16 ring-4 ring-blue-200">
                      <AvatarImage
                        src={user.avatar || '/placeholder.svg'}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-600">
                      {user.name}
                    </h3>
                    <p className="text-slate-600">{user.email}</p>
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
          <Card className="bg-white border-blue-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t('mySubscription')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getPlanColor(user.plan.type)} flex items-center justify-center`}
                  >
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {user.plan.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {user.plan.price === 0
                        ? t('free')
                        : `${user.plan.price}€${t('perMonth')}`}
                    </p>
                  </div>
                </div>
                <Dialog
                  open={isUpgradeDialogOpen}
                  onOpenChange={setIsUpgradeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      {user.plan.type === 'gratuit'
                        ? t('upgrade')
                        : t('changePlan')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] max-h-screen overflow-y-auto bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl p-0 [&>button]:right-2 [&>button]:top-2 [&>button]:w-4 [&>button]:h-4 [&>button]:rounded-full [&>button]:bg-muted/80 [&>button]:hover:bg-muted [&>button]:opacity-100">
                    <DialogTitle></DialogTitle>
                    <div className="flex flex-wrap sm:gap-6 justify-center p-2 sm:p-4">
                      {plans.map((plan) => {
                        const PlanIcon = getPlanIcon(plan.type)
                        const isCurrentPlan = plan.type === user.plan.type
                        const planFeatures = getPlanFeatures(
                          plan.name,
                          plan.featureCount
                        )

                        return (
                          <Card
                            key={plan.type}
                            className={`relative w-[68vw] max-w-[500px] p-5 sm:w-[260px] md:w-[280px] mx-auto my-5 ${
                              plan.popular
                                ? 'border-blue-500 shadow-lg'
                                : 'border-slate-200'
                            } ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
                          >
                            {plan.popular && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-blue-600 text-white px-2 py-1 text-xs">
                                  {t('popular')}
                                </Badge>
                              </div>
                            )}
                            {isCurrentPlan && (
                              <div className="absolute -top-3 right-4">
                                <Badge className="bg-blue-600 text-white px-2 py-1 text-xs">
                                  {t('current')}
                                </Badge>
                              </div>
                            )}
                            <CardHeader className="text-center p-4">
                              <div
                                className={`w-14 h-14 mx-auto rounded-lg bg-gradient-to-r ${getPlanColor(plan.type)} flex items-center justify-center mb-3`}
                              >
                                <PlanIcon className="w-6 h-6 text-white" />
                              </div>
                              <CardTitle className="text-lg sm:text-xl">
                                {t(`plans.${plan.name.toLowerCase()}`)}
                              </CardTitle>
                              <div className="text-2xl sm:text-3xl font-bold text-slate-800">
                                {plan.price === 0
                                  ? t('free')
                                  : `${plan.price}€`}
                              </div>
                              {plan.price > 0 && (
                                <p className="text-xs sm:text-sm text-slate-600">
                                  {t('perMonth')}
                                </p>
                              )}
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                              <ul className="space-y-2 mb-4">
                                {planFeatures.map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-xs sm:text-sm"
                                  >
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                className={`w-full text-sm py-2 ${
                                  isCurrentPlan
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                disabled={isCurrentPlan}
                              >
                                {isCurrentPlan
                                  ? t('currentPlan')
                                  : t('choosePlan')}
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{t('tokenUsage')}</span>
                  <span className="text-blue-600">
                    {user.plan.tokensUsed}/
                    {user.plan.maxTokens === 'unlimited'
                      ? '∞'
                      : user.plan.maxTokens}
                  </span>
                </div>
                {user.plan.maxTokens !== 'unlimited' && (
                  <Progress value={tokensPercentage} className="h-2" />
                )}
              </div>

              <div className="text-sm text-slate-600">
                <p>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t('renewalDate')}{' '}
                  {new Date(user.plan.renewalDate).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-slate-800">
                  {t('includedFeatures')}
                </h4>
                <ul className="space-y-1">
                  {user.plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <div className="w-1 h-1 bg-blue-600 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
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
