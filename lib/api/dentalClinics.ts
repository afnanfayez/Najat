import { request, unwrapPaginated } from '@/lib/api/api'
import {
  dentalClinicsPaginatedResponseSchema,
  dentalClinicsNearbyResponseSchema,
  dentalDtoSchema,
  type DentalClinicsPaginatedResponse,
  type DentalClinicsNearbyResponse,
  type DentalDto,
} from '@/schemas/dentalApi'
import { GAZA_CENTER } from '@/lib/api/geoDefaults'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ListDentalClinicsParams = {
  page?: number
  limit?: number
  since?: string
}

export type NearbyDentalClinicsParams = ListDentalClinicsParams & {
  latitude?: number
  longitude?: number
  radius?: number
}

function buildListQuery(params?: ListDentalClinicsParams): string {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.limit != null) qs.set('limit', String(params.limit))
  if (params?.since) qs.set('since', params.since)
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export const dentalClinicsAPI = {
  list(params?: ListDentalClinicsParams): Promise<DentalClinicsPaginatedResponse> {
    return request(`${V1_ROOT}/dental-clinics${buildListQuery(params)}`).then((raw) =>
      dentalClinicsPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  async nearby(overrides?: NearbyDentalClinicsParams): Promise<DentalClinicsNearbyResponse> {
    const { latitude, longitude, radius } = { ...GAZA_CENTER, ...overrides }
    const qs = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      radius: String(radius),
    })
    if (overrides?.page != null) qs.set('page', String(overrides.page))
    if (overrides?.limit != null) qs.set('limit', String(overrides.limit))
    if (overrides?.since) qs.set('since', overrides.since)
    const raw = await request(`${V1_ROOT}/dental-clinics/nearby?${qs}`)
    return dentalClinicsNearbyResponseSchema.parse(unwrapPaginated(raw))
  },

  getById(id: string): Promise<DentalDto> {
    return request(`${V1_ROOT}/dental-clinics/${encodeURIComponent(id)}`).then((raw) => {
      const asRecord = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
      if (asRecord && 'data' in asRecord && asRecord.data && typeof asRecord.data === 'object') {
        return dentalDtoSchema.parse(asRecord.data)
      }
      return dentalDtoSchema.parse(raw)
    })
  },

  create(formData: FormData): Promise<DentalDto> {
    return request(`${V1_ROOT}/dental-clinics`, { method: 'POST', body: formData }).then((raw) =>
      dentalDtoSchema.parse(raw),
    )
  },

  update(id: string, body: Record<string, unknown> | FormData): Promise<DentalDto> {
    return request(`${V1_ROOT}/dental-clinics/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }).then((raw) => dentalDtoSchema.parse(raw))
  },

  softDelete(id: string): Promise<unknown> {
    return request(`${V1_ROOT}/dental-clinics/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
