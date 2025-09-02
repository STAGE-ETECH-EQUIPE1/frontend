import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Le nom du service est requis'),
  price: z.coerce.number().min(0, 'Le prix doit être positif'),
  token: z.coerce
    .number()
    .min(1, 'Le nombre de tokens doit être supérieur à 0'),
})

export const updateServiceSchema = z.object({
  name: z.string().min(1, 'Le nom du service est requis'),
  price: z.coerce.number().min(0, 'Le prix doit être positif'),
  token: z.coerce
    .number()
    .min(1, 'Le nombre de tokens doit être supérieur à 0'),
})

export type CreateServiceFormData = z.infer<typeof createServiceSchema>
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>
