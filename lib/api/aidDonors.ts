import { request, unwrapPaginated } from '@/lib/api/api'
import {
  aidDonorByIdResponseSchema,
  aidDonorsPaginatedResponseSchema,
  type AidDonorDto,
  type AidDonorsPaginatedResponse,
} from '@/schemas/aidDonorsApi'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export const aidDonorsAPI = {
  list(params?: { limit?: number }): Promise<AidDonorsPaginatedResponse> {
    const qs = new URLSearchParams()
    qs.set('limit', String(params?.limit ?? 100))
    return request(`${V1_ROOT}/aid-donors?${qs}`).then((raw) =>
      aidDonorsPaginatedResponseSchema.parse(unwrapPaginated(raw)),
    )
  },

  getById(id: string): Promise<AidDonorDto> {
    return request(`${V1_ROOT}/aid-donors/${encodeURIComponent(id)}`).then((raw) =>
      aidDonorByIdResponseSchema.parse(raw).data,
    )
  },

  create(body: Record<string, unknown>): Promise<AidDonorDto> {
    return request(`${V1_ROOT}/aid-donors`, {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((raw) => aidDonorByIdResponseSchema.parse(raw).data)
  },

  update(id: string, body: Record<string, unknown>): Promise<AidDonorDto> {
    return request(`${V1_ROOT}/aid-donors/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }).then((raw) => aidDonorByIdResponseSchema.parse(raw).data)
  },

  remove(id: string): Promise<unknown> {
    return request(`${V1_ROOT}/aid-donors/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
