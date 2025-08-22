import { useSignupMutation } from '../services/authApi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupFormData } from '../schema/signupSchema'

export const useSignupForm = () => {
  const [signup, signupState] = useSignupMutation()

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  return { methods, signup, signupState }
}
