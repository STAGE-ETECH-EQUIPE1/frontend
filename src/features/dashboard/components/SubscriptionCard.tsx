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
  PlaneIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useGetSubscriptionForCurrentUserQuery } from '../services/userApi'
import { DynamicPricing } from '@/app/[locale]/(landing)/components/packs/DynamicPricing'

export default function SubscriptionCard({ user }: { user: mockUser }) {
  const { isLoading, data, isError } = useGetSubscriptionForCurrentUserQuery()

  const t = useTranslations('userProfile')
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)

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
              <DynamicPricing />
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
