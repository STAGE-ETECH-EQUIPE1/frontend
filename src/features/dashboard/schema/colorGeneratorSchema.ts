import z from "zod";

export const colorGeneratorSchema = z.object({
  emotion: z.string().nonempty(),
  styleSearch: z.string().nonempty(),
  colorNumber: z.string().nonempty(),
  colorExcepts: z
    .array(z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format de couleur invalide'))
    .min(1, 'Veuillez sélectionner au moins une couleur')
    .max(5, 'Vous ne pouvez pas sélectionner plus de 5 couleurs'),
  colorFavorites: z
    .array(z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format de couleur invalide'))
    .min(1, 'Veuillez sélectionner au moins une couleur')
    .max(5, 'Vous ne pouvez pas sélectionner plus de 5 couleurs'),
})