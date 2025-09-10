import { z } from 'zod'

export const companyToneOfVoiceGeneratorSchema = z.object({
  mission: z.string(),
  vision: z.string(),
  values: z.string(),
  positioning: z.string(),
});
