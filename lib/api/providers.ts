import { request, unwrapPaginated } from '@/lib/api/api'
import { z } from 'zod'
import { paginationMetaSchema } from '@/schemas/hospitalApi'
import { bilingualMessageSchema } from '@/schemas/shared'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ProviderType = 'hospital' | 'dental' | 'clinic' | 'pharmacy' | 'lab'

const providerDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  address: z.string(),
  contactNumber: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  distance: z.coerce.number().optional(),
  workingDoctors: z.array(z.unknown()).optional(),
  workingHours: z.string().optional().nullable(),
  workingDays: z.array(z.string()).optional(),
  currentMedications: z.array(z.unknown()).optional(),
  medicalSupplies: z.array(z.string()).optional(),
  healthcareCategories: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough()

const providersPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(providerDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type ProviderDto = z.infer<typeof providerDtoSchema>
export type ProvidersPaginatedResponse = z.infer<typeof providersPaginatedResponseSchema>

export type ProvidersListParams = {
  page?: number
  limit?: number
  since?: string
  type?: ProviderType
  latitude?: number
  longitude?: number
  radius?: number
}

export type ProvidersNearbyParams = ProvidersListParams & {
  latitude: number
  longitude: number
}

function buildQuery(params: ProvidersListParams): string {
  const qs = new URLSearchParams()
  if (params.page != null) qs.set('page', String(params.page))
  if (params.limit != null) qs.set('limit', String(params.limit))
  if (params.since) qs.set('since', params.since)
  if (params.type) qs.set('type', params.type)
  if (params.latitude != null) qs.set('latitude', String(params.latitude))
  if (params.longitude != null) qs.set('longitude', String(params.longitude))
  if (params.radius != null) qs.set('radius', String(params.radius))
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export const providersAPI = {
  list(params?: ProvidersListParams): Promise<ProvidersPaginatedResponse> {
    return request(`${V1_ROOT}/providers${buildQuery(params ?? {})}`).then((raw) =>
      providersPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  nearby(params: ProvidersNearbyParams): Promise<ProvidersPaginatedResponse> {
    return request(`${V1_ROOT}/providers/nearby${buildQuery(params)}`).then((raw) =>
      providersPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },
}
