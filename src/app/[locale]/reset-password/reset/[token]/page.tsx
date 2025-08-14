'use client'
import { use } from 'react'
import ResetPassword from '@/features/auth/components/ResetPassword'

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  return <ResetPassword isOpen={true} onClose={() => {}} token={token} />
}
