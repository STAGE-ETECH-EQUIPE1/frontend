import { PaymentSecureAcceptanceData } from '@/features/payment/types/PaymentType'
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import { getToken } from '@/shared/utils/localStorage'

export class PaymentApi {
  async initializeSecurePayment(paymentId: string): Promise<{success: boolean, data: PaymentSecureAcceptanceData}> {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.PAYMENT.PAYMENT_SECURE_ACCEPTANCE(paymentId)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${getToken()}`
      }
    })

    if (r.ok) return r.json() as Promise<{success: boolean, data: PaymentSecureAcceptanceData}>
    throw new ApiError(r.status, await r.json())
  }
}

class ApiError extends Error {

  public statusCode: number;
  public data: Record<string, unknown>

  constructor(statusCode: number, data: Record<string, unknown>) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const wait = (duration: number = 1000) => {
  return new Promise((resolve, _) => {
    window.setTimeout(resolve, duration);
  })
}

export const paymentApi = new PaymentApi()