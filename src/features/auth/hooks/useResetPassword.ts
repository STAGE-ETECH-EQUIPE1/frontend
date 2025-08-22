import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetPasswordMutation } from '../services/authApi'
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from '../schema/resetPasswordSchema'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'

export const useResetPasswordForm = (tokenParam?: string) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = tokenParam || searchParams.get('token') || ''
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap()

      toast.success('Mot de passe réinitialisé avec succès !')
      router.push('/auth')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      toast.error(error.data?.message || 'Erreur lors de la réinitialisation')
    }
  }

  return { methods, onSubmit, isLoading }
}
