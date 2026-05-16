import { z } from 'zod'
import { bilingualMessageSchema } from '@/schemas/shared'

export const aidDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  availableSupplies: z.array(z.string()).optional(),
  deletedAt: z.string().nullable().optional(),
  version: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type AidDto = z.infer<typeof aidDtoSchema>

// Aid meta only returns totalItems + syncTimestamp (unlike other endpoints)
const aidMetaSchema = z.object({
  totalItems: z.coerce.number(),
  syncTimestamp: z.string().optional(),
})

export const aidsPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(aidDtoSchema),
  meta: aidMetaSchema,
  timestamp: z.string().optional(),
})

export type AidsPaginatedResponse = z.infer<typeof aidsPaginatedResponseSchema>

export const aidByIdResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: aidDtoSchema,
  timestamp: z.string().optional(),
})
