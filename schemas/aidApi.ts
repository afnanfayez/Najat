import { z } from 'zod'

export const aidDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  availableSupplies: z.array(z.string()).optional(),
  stockStatus: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type AidDto = z.infer<typeof aidDtoSchema>

// Aid API returns a simpler meta than other endpoints (no hasNextPage)
const aidMetaSchema = z.object({
  totalItems: z.coerce.number(),
  syncTimestamp: z.string().optional(),
})

export const aidsPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: z.array(aidDtoSchema),
  meta: aidMetaSchema,
  timestamp: z.string().optional(),
})

export type AidsPaginatedResponse = z.infer<typeof aidsPaginatedResponseSchema>

export const aidByIdResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: aidDtoSchema,
  timestamp: z.string().optional(),
})
