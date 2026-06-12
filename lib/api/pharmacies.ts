import { request, unwrapPaginated } from '@/lib/api/api'
import {
  pharmaciesPaginatedResponseSchema,
  pharmaciesNearbyPaginatedResponseSchema,
  pharmacyDtoSchema,
  type PharmaciesPaginatedResponse,
  type PharmaciesNearbyPaginatedResponse,
  type PharmacyDto,
} from '@/schemas/pharmacyApi'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ListPharmaciesParams = {
  page?: number
  limit?: number
  since?: string
}

export type NearbyPharmaciesParams = ListPharmaciesParams & {
  latitude: number
  longitude: number
  radius?: number
}

function buildListQuery(params?: ListPharmaciesParams): string {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.limit != null) qs.set('limit', String(params.limit))
  if (params?.since) qs.set('since', params.since)
  const q = qs.toString()
  return q ? `?${q}` : ''
}

function buildNearbyQuery(params: NearbyPharmaciesParams): string {
  const qs = new URLSearchParams()
  qs.set('latitude', String(params.latitude))
  qs.set('longitude', String(params.longitude))
  if (params.radius != null) qs.set('radius', String(params.radius))
  if (params.page != null) qs.set('page', String(params.page))
  if (params.limit != null) qs.set('limit', String(params.limit))
  if (params.since) qs.set('since', params.since)
  return `?${qs.toString()}`
}

export const pharmaciesAPI = {
  list(params?: ListPharmaciesParams): Promise<PharmaciesPaginatedResponse> {
    return request(`${V1_ROOT}/pharmacies${buildListQuery(params)}`).then((raw) =>
      pharmaciesPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  nearby(params: NearbyPharmaciesParams): Promise<PharmaciesNearbyPaginatedResponse> {
    return request(`${V1_ROOT}/pharmacies/nearby${buildNearbyQuery(params)}`).then((raw) =>
      pharmaciesNearbyPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  getById(id: string): Promise<PharmacyDto> {
    return request(`${V1_ROOT}/pharmacies/${encodeURIComponent(id)}`).then((raw) => {
      const asRecord = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
      if (asRecord && 'data' in asRecord && asRecord.data && typeof asRecord.data === 'object') {
        return pharmacyDtoSchema.parse(asRecord.data)
      }
      return pharmacyDtoSchema.parse(raw)
    })
  },

  create(body: FormData | Record<string, unknown>): Promise<PharmacyDto> {
    return request(`${V1_ROOT}/pharmacies`, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }).then((raw) => {
      const asRecord = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
      const data = asRecord?.data && typeof asRecord.data === 'object' ? asRecord.data : raw
      return pharmacyDtoSchema.parse(data)
    })
  },

  update(id: string, body: Record<string, unknown> | FormData): Promise<PharmacyDto> {
    return request(`${V1_ROOT}/pharmacies/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }).then((raw) => {
      const asRecord = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
      const data = asRecord?.data && typeof asRecord.data === 'object' ? asRecord.data : raw
      return pharmacyDtoSchema.parse(data)
    })
  },

  softDelete(id: string): Promise<unknown> {
    return request(`${V1_ROOT}/pharmacies/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
