import { request, unwrapPaginated } from '@/lib/api/api'
import {
  clinicsPaginatedResponseSchema,
  clinicsNearbyResponseSchema,
  clinicDtoSchema,
  type ClinicsPaginatedResponse,
  type ClinicsNearbyResponse,
  type ClinicDto,
} from '@/schemas/clinicApi'
import { GAZA_CENTER } from '@/lib/api/geoDefaults'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export type ListClinicsParams = {
  page?: number
  limit?: number
  since?: string
}

export type NearbyClinicsParams = ListClinicsParams & {
  latitude?: number
  longitude?: number
  radius?: number
}

function buildListQuery(params?: ListClinicsParams): string {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.limit != null) qs.set('limit', String(params.limit))
  if (params?.since) qs.set('since', params.since)
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export const clinicsAPI = {
  list(params?: ListClinicsParams): Promise<ClinicsPaginatedResponse> {
    return request(`${V1_ROOT}/clinics${buildListQuery(params)}`).then((raw) =>
      clinicsPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  async nearby(overrides?: NearbyClinicsParams): Promise<ClinicsNearbyResponse> {
    const { latitude, longitude, radius } = { ...GAZA_CENTER, ...overrides }
    const qs = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      radius: String(radius),
    })
    if (overrides?.page != null) qs.set('page', String(overrides.page))
    if (overrides?.limit != null) qs.set('limit', String(overrides.limit))
    if (overrides?.since) qs.set('since', overrides.since)
    const raw = await request(`${V1_ROOT}/clinics/nearby?${qs}`)
    return clinicsNearbyResponseSchema.parse(unwrapPaginated(raw))
  },

  getById(id: string): Promise<ClinicDto> {
    return request(`${V1_ROOT}/clinics/${encodeURIComponent(id)}`).then((raw) => {
      const asRecord = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
      if (asRecord && 'data' in asRecord && asRecord.data && typeof asRecord.data === 'object') {
        return clinicDtoSchema.parse(asRecord.data)
      }
      return clinicDtoSchema.parse(raw)
    })
  },

  create(formData: FormData): Promise<ClinicDto> {
    return request(`${V1_ROOT}/clinics`, { method: 'POST', body: formData }).then((raw) =>
      clinicDtoSchema.parse(raw),
    )
  },

  update(id: string, body: Record<string, unknown> | FormData): Promise<ClinicDto> {
    return request(`${V1_ROOT}/clinics/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }).then((raw) => clinicDtoSchema.parse(raw))
  },

  softDelete(id: string): Promise<unknown> {
    return request(`${V1_ROOT}/clinics/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
