import { z } from 'zod'

export const createPackSchema = z.object({
  name: z.string().min(1, 'Le nom du pack est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
  startedAt: z.string().min(1, 'La date de début est requise'),
  expiredAt: z.string().min(1, 'La date de fin est requise'),
  services: z
    .array(z.number())
    .min(1, 'Au moins un service doit être sélectionné'),
})

export type CreatePackFormData = z.infer<typeof createPackSchema>
