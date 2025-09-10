import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  CreditCard,
  Crown,
  PlaneIcon,
  Target,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useGetSubscriptionForCurrentUserQuery } from '../services/userApi'

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

export default function SubscriptionCard({ user }: { user: mockUser }) {
  const { isLoading, data, isError } = useGetSubscriptionForCurrentUserQuery()

  const t = useTranslations('userProfile')
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)

  const getPlanFeatures = (planName: string, featureCount: number) => {
    const features: string[] = []
    for (let i = 1; i <= featureCount; i++) {
      const featureKey = `planFeatures.${planName}.feature${i}`
      features.push(t(featureKey))
    }
    return features
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

  const tokensPercentage = (() => {
    const maxTokens = user.plan.maxTokens as number | 'unlimited'
    return maxTokens === 'unlimited' ? 0 : (user.tokensUsed / maxTokens) * 100
  })()

  if (isLoading) {
    return (
      <>
        <h1>Chargement</h1>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <h1>Pas d&apos;abonnement</h1>
      </>
    )
  }

  return (
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
              <PlaneIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                {data?.data.name}
              </h3>
              <p className="text-sm text-slate-600">
                {parseInt(data?.data.pack.price as string) === 0
                  ? t('free')
                  : `${data?.data.pack.price}€${t('perMonth')}`}
              </p>
            </div>
          </div>

          <Dialog
            open={isUpgradeDialogOpen}
            onOpenChange={setIsUpgradeDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {user.plan.type === 'gratuit' ? t('upgrade') : t('changePlan')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] max-h-screen overflow-y-auto bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl p-0 [&>button]:right-2 [&>button]:top-2 [&>button]:w-4 [&>button]:h-4 [&>button]:rounded-full [&>button]:bg-muted/80 [&>button]:hover:bg-muted [&>button]:opacity-100">
              <DialogTitle></DialogTitle>
              <div className="flex flex-wrap sm:gap-6 justify-center p-2 sm:p-4">
                {plans.map((plan) => {
                  const Icon = getPlanIcon(plan.type)
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
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl">
                          {t(`plans.${plan.name.toLowerCase()}`)}
                        </CardTitle>
                        <div className="text-2xl sm:text-3xl font-bold text-slate-800">
                          {plan.price === 0 ? t('free') : `${plan.price}€`}
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
                          className={`w-full text-sm py-2 ${isCurrentPlan ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? t('currentPlan') : t('choosePlan')}
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
              {user.tokensUsed}/
              {(user.plan.maxTokens as number | 'unlimited') === 'unlimited'
                ? '∞'
                : (user.plan.maxTokens as number)}
            </span>
          </div>
          {(user.plan.maxTokens as number | 'unlimited') !== 'unlimited' && (
            <Progress value={tokensPercentage} className="h-2" />
          )}
        </div>

        <div className="text-sm text-slate-600">
          <p>
            <Calendar className="w-4 h-4 inline mr-1" />
            {t('renewalDate')}{' '}
            {new Date(data?.data.endedAt as string).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-slate-800">
            {t('includedFeatures')}
          </h4>
          <ul className="space-y-1">
            {data?.data.services.map((service, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                {service.name}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

type mockUser = {
  id: string
  name: string
  username: string
  email: string
  phone: string
  avatar: string
  status: 'active'
  joinedAt: string
  lastActive: string
  totalLogos: number
  totalDownloads: number
  tokensUsed: number
  plan: {
    id: string
    name: string
    type: 'gratuit' | 'premium' | 'entreprise'
    price: number
    tokens: number
    maxTokens: number | 'unlimited'
    features: string[]
    isActive: boolean
    subscribersCount: number
    createdAt: string
    updatedAt: string
    renewalDate: string
  }
  stats: {
    totalLogos: number
    totalDownloads: number
    favoriteLogos: number
    commentsGiven: number
  }
}
