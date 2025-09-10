import {
  PaymentData,
  PaymentSecureAcceptanceData,
} from '@/features/payment/types/PaymentType'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import { ApiError } from '@/shared/services/BaseService';
import { getToken } from '@/shared/utils/localStorage'
import { PackResponse } from '@/types/service'

export class PaymentApi {
  async initializeSecurePayment(
    paymentId: number
  ): Promise<{ success: boolean; data: PaymentSecureAcceptanceData }> {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.PAYMENT.PAYMENT_SECURE_ACCEPTANCE(paymentId)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      }
    )

    if (r.ok)
      return r.json() as Promise<{
        success: boolean
        data: PaymentSecureAcceptanceData
      }>
    throw new ApiError(r.status, await r.json())
  }

  async getResumePaymentByReferenceAndTransactionId(
    referenceId: string,
    transactionId: string
  ): Promise<{ success: boolean; data: PaymentData }> {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.PAYMENT.GET_PAYMENT_RESUME}`
    )
    url.searchParams.set('reference', transactionId)
    url.searchParams.set('referenceDevis', referenceId)
    const r = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (r.ok)
      return r.json() as Promise<{ success: boolean; data: PaymentData }>
    throw new ApiError(r.status, await r.json())
  }

  async getPackById(
    id: number
  ): Promise<{ success: boolean; data: PackResponse }> {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.PACKS.GET_BY_ID(id)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (r.ok)
      return r.json() as Promise<{ success: boolean; data: PackResponse }>
    throw new ApiError(r.status, await r.json())
  }
}

export const paymentApi = new PaymentApi()
