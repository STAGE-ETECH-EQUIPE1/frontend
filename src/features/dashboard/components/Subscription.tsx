'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  CreditCard,
  User,
  Package,
  AlertCircle,
} from 'lucide-react'
import { useCreateSubscriptionMutation } from '../services/subscriptionApi'
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from '../schema/subscriptionSchema'
import type { Pack, Service } from '@/features/admin/types/pack'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  pack: Pack
  services: Service[]
  totalPrice: number
}

export function SubscriptionModal({
  isOpen,
  onClose,
  pack,
  services,
  totalPrice,
}: SubscriptionModalProps) {
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      clientId: 1,
      paymentId: 1,
      duration: 12,
      services: services.map((service) => service.id),
    },
  })

  const duration = watch('duration')

  const generateReference = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `SUB-${year}-${month}-${random}`
  }

  const calculateEndDate = (startDate: Date, durationMonths: number) => {
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + durationMonths)
    return endDate
  }

  const onSubmit = async (data: SubscriptionFormData) => {
    const startDate = new Date()
    const endDate = calculateEndDate(startDate, data.duration)

    const subscriptionData = {
      name: `Abonnement ${pack.name}`,
      reference: generateReference(),
      status: 'active' as const,
      startedAt: startDate.toISOString(),
      endedAt: endDate.toISOString(),
      paymentId: data.paymentId || 1,
      services: data.services,
      clientId: data.clientId,
    }

    try {
      const result = await createSubscription(subscriptionData).unwrap()
      console.log(result)
      onClose()
      alert('Abonnement créé avec succès!')
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement:", error)
      alert("Erreur lors de la création de l'abonnement")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  S&apos;abonner au {pack.name}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Détails du pack</span>
                </div>
                <p className="text-gray-600 mb-2">{pack.name}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalPrice.toFixed(2)} €
                  <span className="text-sm font-normal">/mois</span>
                </p>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Services inclus:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {services.map((service) => (
                      <li key={service.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        {service.name} ({service.token || service.tokens}{' '}
                        tokens)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Durée de l&apos;abonnement
                  </label>
                  <select
                    {...register('duration', { valueAsNumber: true })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value={1}>1 mois</option>
                    <option value={3}>3 mois</option>
                    <option value={6}>6 mois</option>
                    <option value={12}>12 mois</option>
                    <option value={24}>24 mois</option>
                  </select>
                  {errors.duration && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.duration.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    ID Client
                  </label>
                  <input
                    type="number"
                    {...register('clientId', { valueAsNumber: true })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.clientId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.clientId && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.clientId.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4" />
                    ID Paiement (optionnel)
                  </label>
                  <input
                    type="number"
                    {...register('paymentId', { valueAsNumber: true })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.paymentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.paymentId && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.paymentId.message}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {(totalPrice * duration).toFixed(2)} €
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Création en cours...' : "Créer l'abonnement"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
