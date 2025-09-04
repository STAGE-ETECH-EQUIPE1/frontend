import { useCallback } from 'react'
import { PaymentSecureAcceptanceData } from '@/features/payment/types/PaymentType'
import { paymentApi } from '@/features/payment/services/paymentApi'

export function usePaymentSecure() {
  const initSecureAcceptance = useCallback(
    async (paymentId: string): Promise<PaymentSecureAcceptanceData> => {
      const { data } = await paymentApi.initializeSecurePayment(paymentId)
      return data
    },
    []
  )

  return {
    initSecureAcceptance,
  }
}
