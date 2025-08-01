'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Activity,
} from 'lucide-react'
import type { User, Plan, LogoFeedback } from '@/types/admin'
import LanguageSwitcher from '../translation/LanguageSwitcher'

interface AdminDashboardProps {
  users: User[]
  plans: Plan[]
  feedbacks: LogoFeedback[]
}

export function AdminDashboard({ users, feedbacks }: AdminDashboardProps) {
  const t = useTranslations('admin.dashboard')
  const tCommon = useTranslations('admin.common')

  // Calculs des statistiques
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === 'active').length
  const totalRevenue = users.reduce((sum, user) => sum + user.plan.price, 0)
  const avgRating =
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0

  const systemMetrics = [
    { name: t('cpu'), value: 45, status: 'optimal' },
    { name: t('ram'), value: 67, status: 'warning' },
    { name: t('storage'), value: 23, status: 'optimal' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600'
      case 'warning':
        return 'text-amber-600'
      case 'critical':
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal':
        return t('optimal')
      case 'warning':
        return t('warning')
      case 'critical':
        return t('critical')
      default:
        return status
    }
  }

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="space-y-6"
    >
      {/* Header */}
      <header>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {t('title')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse text-xs sm:text-sm">
              <Activity className="w-3 h-3 mr-1" />
              {tCommon('online').toUpperCase()}
            </Badge>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          {
            title: t('users'),
            value: totalUsers,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            change: '+12%',
          },
          {
            title: t('active'),
            value: activeUsers,
            icon: Activity,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            change: '+8%',
          },
          {
            title: t('revenue'),
            value: `${totalRevenue}€`,
            icon: DollarSign,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            change: '+23%',
          },
          {
            title: t('avgRating'),
            value: avgRating.toFixed(1),
            icon: MessageSquare,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            change: '+0.2',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card
              className={`bg-white ${stat.borderColor} border hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon
                      className={`w-3 sm:w-4 h-3 sm:h-4 ${stat.color}`}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{stat.change}</span>
                  <span className="text-slate-500 hidden sm:inline">
                    {t('vsLastMonth')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2 text-base sm:text-lg">
                <Package className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-600" />
                {t('systemMetrics')}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                {t('serverResources')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-sm font-medium text-slate-700">
                        {metric.name}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(metric.status).replace('text-', 'bg-')}`}
                      />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                      {metric.value}%
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="mt-2 text-xs">
                      <span className={getStatusColor(metric.status)}>
                        {getStatusText(metric.status)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                {t('recentActivity')}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                {t('lastSystemActions')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    time: '14:32',
                    action: t('newUser'),
                    user: 'startup@example.com',
                    type: 'success',
                  },
                  {
                    time: '14:28',
                    action: t('logoGenerated'),
                    user: 'TechCorp_CEO',
                    type: 'info',
                  },
                  {
                    time: '14:25',
                    action: t('paymentReceived'),
                    user: 'DesignStudio',
                    type: 'success',
                  },
                  {
                    time: '14:20',
                    action: t('feedbackSubmitted'),
                    user: 'StartupLover',
                    type: 'info',
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="text-xs text-slate-500 w-8 sm:w-12">
                      {activity.time}
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-700 truncate">
                        {activity.action}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {activity.user}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
