import z from 'zod'

export const fileToProvideSchema = z.object({
  companyArea: z.string().nonempty(),
  publicTarget: z.string().nonempty(),
  mainLanguage: z.string().nonempty(),
  mainService: z.string().nonempty(),
})
