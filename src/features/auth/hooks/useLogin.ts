import { useLoginMutation } from '../services/authApi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '../schema/loginSchema'

export const useLoginForm = () => {
  const [login, loginState] = useLoginMutation()

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return { methods, login, loginState }
}
