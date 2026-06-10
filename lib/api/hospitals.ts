import { request, unwrapPaginated } from '@/lib/api/api'
import {
  hospitalDtoSchema,
  hospitalEntitySchema,
  hospitalsNearbyPaginatedResponseSchema,
  hospitalsPaginatedResponseSchema,
  parseHospitalGetByIdResponse,
  type HospitalCapacityStatus,
  type HospitalDto,
  type HospitalEntity,
  type HospitalsNearbyPaginatedResponse,
  type HospitalsPaginatedResponse,
} from '@/schemas/hospitalApi'

/**
 * OpenAPI paths are `/api/v1/hospitals` from the server root.
 * When `NEXT_PUBLIC_BASE_URL` includes the `/api` prefix (e.g. Railway:
 * `https://graduation-project-api-production-8251.up.railway.app/api`), this must be `/v1` only so the
 * final URL is `{BASE}/v1/hospitals` → `.../api/v1/hospitals`.
 * If `NEXT_PUBLIC_BASE_URL` is the origin only, set `NEXT_PUBLIC_API_V1_ROOT=/api/v1`.
 */
const V1_ROOT =
  process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

function parseOrThrow<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
  return schema.parse(data)
}

export type ListHospitalsParams = {
  page?: number
  limit?: number
  since?: string
}

export type NearbyHospitalsParams = ListHospitalsParams & {
  latitude: number
  longitude: number
  radius?: number
}

function buildHospitalListQuery(params?: ListHospitalsParams): string {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.limit != null) qs.set('limit', String(params.limit))
  if (params?.since) qs.set('since', params.since)
  const q = qs.toString()
  return q ? `?${q}` : ''
}

function buildNearbyQuery(params: NearbyHospitalsParams): string {
  const qs = new URLSearchParams()
  qs.set('latitude', String(params.latitude))
  qs.set('longitude', String(params.longitude))
  if (params.radius != null) qs.set('radius', String(params.radius))
  if (params.page != null) qs.set('page', String(params.page))
  if (params.limit != null) qs.set('limit', String(params.limit))
  if (params.since) qs.set('since', params.since)
  return `?${qs.toString()}`
}

export const hospitalsAPI = {
  list(params?: ListHospitalsParams): Promise<HospitalsPaginatedResponse> {
    const suffix = `${V1_ROOT}/hospitals${buildHospitalListQuery(params)}`
    return request(suffix).then((raw) =>
      parseOrThrow(hospitalsPaginatedResponseSchema, unwrapPaginated(raw)),
    )
  },

  nearby(
    params: NearbyHospitalsParams,
  ): Promise<HospitalsNearbyPaginatedResponse> {
    const suffix = `${V1_ROOT}/hospitals/nearby${buildNearbyQuery(params)}`
    return request(suffix).then((raw) =>
      parseOrThrow(hospitalsNearbyPaginatedResponseSchema, unwrapPaginated(raw)),
    )
  },

  getById(id: string): Promise<HospitalDto> {
    return request(`${V1_ROOT}/hospitals/${encodeURIComponent(id)}`).then(
      parseHospitalGetByIdResponse,
    )
  },

  /** ADMIN — multipart/form-data */
  create(formData: FormData): Promise<HospitalDto> {
    return request(`${V1_ROOT}/hospitals`, {
      method: 'POST',
      body: formData,
    }).then((raw) => parseOrThrow(hospitalDtoSchema, raw))
  },

  /** ADMIN — JSON body shape depends on backend */
  update(
    id: string,
    body: Record<string, unknown> | FormData,
  ): Promise<HospitalEntity> {
    return request(`${V1_ROOT}/hospitals/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }).then((raw) => parseOrThrow(hospitalEntitySchema, raw))
  },

  softDelete(id: string): Promise<unknown> {
    return request(`${V1_ROOT}/hospitals/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },

  /** ADMIN | VOLUNTEER */
  updateStatus(
    id: string,
    payload: { status: HospitalCapacityStatus },
  ): Promise<HospitalEntity> {
    return request(
      `${V1_ROOT}/hospitals/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    ).then((raw) => parseOrThrow(hospitalEntitySchema, raw))
  },
}
