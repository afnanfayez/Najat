import { request, unwrapPaginated } from '@/lib/api/api'
import {
  labsPaginatedResponseSchema,
  labsNearbyPaginatedResponseSchema,
  labDtoSchema,
  type LabsPaginatedResponse,
  type LabsNearbyPaginatedResponse,
  type LabDto,
} from '@/schemas/labApi'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ListLabsParams = {
  page?: number
  limit?: number
  since?: string
}

export type NearbyLabsParams = ListLabsParams & {
  latitude: number
  longitude: number
  radius?: number
}

function buildListQuery(params?: ListLabsParams): string {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.limit != null) qs.set('limit', String(params.limit))
  if (params?.since) qs.set('since', params.since)
  const q = qs.toString()
  return q ? `?${q}` : ''
}

function buildNearbyQuery(params: NearbyLabsParams): string {
  const qs = new URLSearchParams()
  qs.set('latitude', String(params.latitude))
  qs.set('longitude', String(params.longitude))
  if (params.radius != null) qs.set('radius', String(params.radius))
  if (params.page != null) qs.set('page', String(params.page))
  if (params.limit != null) qs.set('limit', String(params.limit))
  if (params.since) qs.set('since', params.since)
  return `?${qs.toString()}`
}

export const labsAPI = {
  list(params?: ListLabsParams): Promise<LabsPaginatedResponse> {
    return request(`${V1_ROOT}/labs${buildListQuery(params)}`).then((raw) =>
      labsPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  nearby(params: NearbyLabsParams): Promise<LabsNearbyPaginatedResponse> {
    return request(`${V1_ROOT}/labs/nearby${buildNearbyQuery(params)}`).then((raw) =>
      labsNearbyPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  getById(id: string): Promise<LabDto> {
    return request(`${V1_ROOT}/labs/${encodeURIComponent(id)}`).then((raw) => {
      const asRecord = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
      if (asRecord && 'data' in asRecord && asRecord.data && typeof asRecord.data === 'object') {
        return labDtoSchema.parse(asRecord.data)
      }
      return labDtoSchema.parse(raw)
    })
  },

  create(formData: FormData): Promise<LabDto> {
    return request(`${V1_ROOT}/labs`, { method: 'POST', body: formData }).then((raw) =>
      labDtoSchema.parse(raw),
    )
  },

  update(id: string, body: Record<string, unknown> | FormData): Promise<LabDto> {
    return request(`${V1_ROOT}/labs/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }).then((raw) => labDtoSchema.parse(raw))
  },

  softDelete(id: string): Promise<unknown> {
    return request(`${V1_ROOT}/labs/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
