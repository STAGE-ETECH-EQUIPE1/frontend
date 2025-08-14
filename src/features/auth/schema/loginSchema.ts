import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Minimum 6 caractères' }),
})

export type LoginFormData = z.infer<typeof loginSchema>
