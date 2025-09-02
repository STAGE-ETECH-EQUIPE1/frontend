import { z } from "zod"

export const subscriptionSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),

  duration: z.number().min(1, "La durée doit être d'au moins 1 mois").max(60, "La durée ne peut pas dépasser 60 mois"),

  clientId: z.number().min(1, "L'ID client est requis").positive("L'ID client doit être positif"),

  services: z
    .array(z.number())
    .min(1, "Au moins un service doit être sélectionné")
    .max(20, "Trop de services sélectionnés"),

  paymentId: z.number().min(1, "L'ID de paiement est requis").positive("L'ID de paiement doit être positif").optional(),
})

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>

export const createSubscriptionSchema = subscriptionSchema.extend({
  reference: z.string().min(1, "La référence est requise"),
  status: z.enum(["active", "inactive", "pending", "cancelled"]),
  startedAt: z.string().datetime("Format de date invalide"),
  endedAt: z.string().datetime("Format de date invalide"),
})

export type CreateSubscriptionData = z.infer<typeof createSubscriptionSchema>
