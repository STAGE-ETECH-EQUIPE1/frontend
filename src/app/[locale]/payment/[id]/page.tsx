import PaymentForm from '@/features/payment/components/initialization/PaymentForm'
import { use } from 'react'

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = use(params)
  return <PaymentForm packId={id} />
}
