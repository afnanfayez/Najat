import { z } from 'zod'

export const bilingualMessageSchema = z.union([
  z.string(),
  z.object({ en: z.string(), ar: z.string() }),
])

export type BilingualMessage = z.infer<typeof bilingualMessageSchema>
