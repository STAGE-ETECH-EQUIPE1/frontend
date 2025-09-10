import z from 'zod'

export const typographieGeneratorSchema = z.object({
  styleSearch: z.string().nonempty(),
})
