import { z } from 'zod'

export const companyNameGeneratorSchema = z.object({
  includeKeywords: z.string().min(1, 'Au moins un mot-clé requis'),
  excludeKeywords: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']),
  style: z.enum(['modern', 'classic', 'minimalist']),
  language: z.enum(['fr', 'en', 'es']),
  checkSocialMedia: z.boolean().optional(),
})
