import { request, unwrapPaginated } from '@/lib/api/api'
import {
  aidsPaginatedResponseSchema,
  aidByIdResponseSchema,
  aidNearbyEnvelopeSchema,
  nearbyAidPointDtoSchema,
  type AidsPaginatedResponse,
  type AidDto,
  type NearbyAidPointDto,
} from '@/schemas/aidApi'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ListAidParams = {
  page?: number
  limit?: number
  since?: string
}

export type AidStatus = 'active' | 'suspended' | 'limited'

export const aidAPI = {
  list(params?: ListAidParams): Promise<AidsPaginatedResponse> {
    const qs = new URLSearchParams()
    if (params?.page != null) qs.set('page', String(params.page))
    if (params?.limit != null) qs.set('limit', String(params.limit))
    if (params?.since) qs.set('since', params.since)
    const query = qs.toString()
    return request(`${V1_ROOT}/aid${query ? `?${query}` : ''}`).then((raw) =>
      aidsPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  getById(id: string): Promise<AidDto> {
    return request(`${V1_ROOT}/aid/${encodeURIComponent(id)}`).then((raw) =>
      aidByIdResponseSchema.parse(raw).data,
    )
  },

  nearby(params: {
    lat: number
    lng: number
    radius?: number
  }): Promise<NearbyAidPointDto[]> {
    const qs = new URLSearchParams()
    qs.set('lat', String(params.lat))
    qs.set('lng', String(params.lng))
    qs.set('radius', String(params.radius ?? 5000))
    return request(`${V1_ROOT}/aid/nearby?${qs}`).then((raw) => {
      const envelope = aidNearbyEnvelopeSchema.safeParse(raw)
      if (envelope.success) {
        return envelope.data.data
      }
      if (Array.isArray(raw)) {
        return raw.map((item: unknown) =>
          nearbyAidPointDtoSchema.parse(item),
        ) as NearbyAidPointDto[]
      }
      const data = (raw as { data?: unknown })?.data
      if (Array.isArray(data)) {
        return data.map((item: unknown) =>
          nearbyAidPointDtoSchema.parse(item),
        ) as NearbyAidPointDto[]
      }
      return []
    })
  },

  create(body: Record<string, unknown>): Promise<AidDto> {
    return request(`${V1_ROOT}/aid`, {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((raw) => aidByIdResponseSchema.parse(raw).data)
  },

  update(id: string, body: Record<string, unknown>): Promise<AidDto> {
    return request(`${V1_ROOT}/aid/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }).then((raw) => aidByIdResponseSchema.parse(raw).data)
  },

  updateStatus(id: string, payload: { status: AidStatus }): Promise<AidDto> {
    return request(`${V1_ROOT}/aid/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then((raw) => aidByIdResponseSchema.parse(raw).data)
  },

  softDelete(id: string): Promise<unknown> {
    return request(`${V1_ROOT}/aid/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
