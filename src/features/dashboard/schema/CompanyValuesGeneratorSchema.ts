import { z } from 'zod'

export const companyValuesGeneratorSchema = z.object({
  customer_pain_points: z.string(),
  customer_promise: z.string(),
  mission: z.string(),
  vision: z.string(),
  culture: z.string(),
  strengths: z.string(),
  competitors: z.string(),
  preferred_values: z.string(),
  inspiring_companies: z.string(),
})
