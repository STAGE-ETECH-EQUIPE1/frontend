import { z } from "zod"

export enum LogoStyleEnum {
  Modern = "modern",
  Classic = "classic",
  Minimalist = "minimalist",
  Creative = "creative",
  Corporate = "corporate",
  Playful = "playful",
}
// Schema de validation pour la création d'un projet de branding
export const createBrandingProjectSchema = z.object({
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  slogan: z
    .string()
    .min(2, "Le slogan doit contenir au moins 2 caractères")
    .max(100, "Le slogan ne peut pas dépasser 100 caractères"),
    logoStyle: z.nativeEnum(LogoStyleEnum, {
    error: () => ({ message: "Veuillez sélectionner un style de logo valide" }),
  }),
  colorPreferences: z
    .array(z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format de couleur invalide"))
    .min(1, "Veuillez sélectionner au moins une couleur")
    .max(5, "Vous ne pouvez pas sélectionner plus de 5 couleurs"),
  brandKeywords: z
    .array(z.string().min(2, "Chaque mot-clé doit contenir au moins 2 caractères"))
    .min(1, "Veuillez ajouter au moins un mot-clé")
    .max(10, "Vous ne pouvez pas ajouter plus de 10 mots-clés"),
})

export type CreateBrandingProjectFormData = z.infer<typeof createBrandingProjectSchema>

// Schema pour la mise à jour d'un projet
export const updateBrandingProjectSchema = createBrandingProjectSchema.partial()

export type UpdateBrandingProjectFormData = z.infer<typeof updateBrandingProjectSchema>
