import { z } from 'zod'

export const signupSchema = z
  .object({
    email: z.string().email(),
    phone: z.string().min(10),
    fullName: z.string().min(2),
    username: z.string().min(3),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>
