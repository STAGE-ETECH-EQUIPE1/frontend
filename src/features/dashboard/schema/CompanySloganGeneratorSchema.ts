import { z } from "zod";

export const companySloganResponseSchema = z.object({
  include_keywords: z.string(),
  exclude_keywords: z.string(),
  length: z.enum(["court", "moyen", "long"]),
  tone: z.string(),
  langue: z.enum(["français", "anglais", "espagnol"]),
  focus: z.string().optional(),
});
