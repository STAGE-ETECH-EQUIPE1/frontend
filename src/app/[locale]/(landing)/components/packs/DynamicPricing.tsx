'use client'

import { motion } from 'framer-motion'
import { DynamicPricingCard } from './DynamicPricingCard'
import {
  useGetPacksQuery,
  useGetServicesQuery,
} from '@/features/admin/services/packApi'
import type { Pack, Service } from '@/features/admin/types/pack'
import { useTranslations } from 'next-intl'

export function DynamicPricing() {
  const t = useTranslations('dynamicPricing')

  const { data: packs = [], isLoading: packsLoading } = useGetPacksQuery()
  const { data: allServices = [], isLoading: servicesLoading } =
    useGetServicesQuery()

  const isService = (service: unknown): service is Service =>
    typeof service === 'object' && service !== null && 'id' in service

  const getServicesFromPack = (pack: Pack): Service[] => {
    if (!pack.services) return []

    if (typeof pack.services === 'object' && !Array.isArray(pack.services)) {
      return Object.values(pack.services).filter(isService)
    }

    if (Array.isArray(pack.services)) {
      return (pack.services as (Service | number)[]).filter(isService)
    }

    return []
  }

  const getServiceWithPrice = (service: Service) => {
    const fullService = allServices.find((s) => s.id === service.id)
    return {
      ...service,
      price: fullService?.price || service.price || '0',
    }
  }

  const calculatePackTotalPrice = (pack: Pack): number => {
    const services = getServicesFromPack(pack)
    return services.reduce((total, service) => {
      const serviceWithPrice = getServiceWithPrice(service)
      return total + Number(serviceWithPrice.price || 0)
    }, 0)
  }

  const categorizePack = (pack: Pack): 'free' | 'pro' | 'enterprise' => {
    const totalPrice = calculatePackTotalPrice(pack)
    if (totalPrice === 0) return 'free'
    if (totalPrice <= 1000) return 'pro'
    return 'enterprise'
  }

  const sortedPacks = [...packs].sort((a, b) => {
    const categoryOrder = { free: 0, pro: 1, enterprise: 2 }
    const categoryA = categorizePack(a)
    const categoryB = categorizePack(b)

    if (categoryA !== categoryB) {
      return categoryOrder[categoryA] - categoryOrder[categoryB]
    }

    return calculatePackTotalPrice(a) - calculatePackTotalPrice(b)
  })

  if (packsLoading || servicesLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (packs.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('comingSoonTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('comingSoonText')}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('chooseTitle')}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('chooseHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('chooseSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sortedPacks.map((pack, index) => {
            const category = categorizePack(pack)
            const isPopular = category === 'pro' && index === 1

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <DynamicPricingCard
                  pack={pack}
                  allServices={allServices}
                  category={category}
                  isPopular={isPopular}
                  calculatePackTotalPrice={calculatePackTotalPrice}
                  getServicesFromPack={getServicesFromPack}
                  getServiceWithPrice={getServiceWithPrice}
                />
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">{t('customSolution')}</p>
          <button className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 transition-colors">
            {t('contactTeam')}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
