'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Star } from 'lucide-react'
import type { Pack, Service } from '@/features/admin/types/pack'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import toast from 'react-hot-toast'

interface DynamicPricingCardProps {
  pack: Pack
  allServices: Service[]
  category: 'free' | 'pro' | 'enterprise'
  isPopular?: boolean
  calculatePackTotalPrice: (pack: Pack) => number
  getServicesFromPack: (pack: Pack) => Service[]
  getServiceWithPrice: (service: Service) => Service & { price: string }
}

export function DynamicPricingCard({
  pack,
  category,
  isPopular = false,
  calculatePackTotalPrice,
  getServicesFromPack,
  getServiceWithPrice,
}: DynamicPricingCardProps) {
  const t = useTranslations('pricing')

  const { user } = useAuth()

  const params = useParams()
  const locale = params.locale as string

  const router = useRouter()

  const services = getServicesFromPack(pack)
  const totalPrice = calculatePackTotalPrice(pack)

  const redirectToPayment = (id: number): void => {
    if (user) {
      router.replace(`/${locale}/payment/${id}`)
    } else {
      toast.error(t('connectError'))
    }
  }

  const getCategoryStyles = () => {
    switch (category) {
      case 'free':
        return {
          gradient: 'from-gray-50 to-gray-100',
          border: 'border-gray-200',
          button: 'bg-gray-600 hover:bg-gray-700 text-white',
          accent: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-700',
        }
      case 'pro':
        return {
          gradient: 'from-blue-50 to-indigo-100',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          accent: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700',
        }
      case 'enterprise':
        return {
          gradient: 'from-green-50 to-emerald-100',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700 text-white',
          accent: 'text-green-600',
          badge: 'bg-green-100 text-green-700',
        }
    }
  }

  const styles = getCategoryStyles()

  return (
    <Card
      className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${styles.border} ${isPopular ? 'ring ring-blue-500' : ''}`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            {t('popular')}
          </Badge>
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-1`}
      />

      <CardHeader className="relative z-10 text-center pb-8 pt-8">
        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
          {pack.name}
        </CardTitle>

        <div className="space-y-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {totalPrice === 0 ? t('free') : `${totalPrice.toFixed(2)}€`}
            </span>
            {totalPrice > 0 && (
              <span className="text-gray-600 text-sm">{t('perPack')}</span>
            )}
          </div>

          <Badge className={styles.badge}>
            {t('servicesIncluded', { count: services.length })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <div className="space-y-3">
          {services.length > 0 ? (
            services.map((service) => {
              const serviceWithPrice = getServiceWithPrice(service)
              return (
                <div key={service.id} className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full ${styles.button} flex items-center justify-center mt-0.5`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900 leading-tight flex-1 pr-2">
                        {service.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs flex-shrink-0 ml-2"
                      >
                        {serviceWithPrice.price &&
                        Number(serviceWithPrice.price) > 0
                          ? `${Number(serviceWithPrice.price).toFixed(2)}€`
                          : t('free')}
                      </Badge>
                    </div>
                    {(service.token || service.tokens) && (
                      <div className="text-lg text-black mt-1">
                        Tokens: {service.token || service.tokens}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center text-gray-500 py-4">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('customServices')}</p>
            </div>
          )}
        </div>

        <Button
          className={`w-full py-3 text-base font-semibold transition-all duration-200 ${styles.button}`}
          size="lg"
          onClick={() => redirectToPayment(pack.id)}
        >
          {totalPrice === 0 ? t('startFree') : t('choosePack')}
        </Button>

        {pack.startedAt && pack.expiredAt && (
          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-200">
            {t('validity', {
              start: new Date(pack.startedAt).toLocaleDateString(),
              end: new Date(pack.expiredAt).toLocaleDateString(),
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
