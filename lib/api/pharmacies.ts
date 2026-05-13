import { request } from '@/lib/api/api'
import {
  pharmaciesPaginatedResponseSchema,
  type PharmaciesPaginatedResponse,
} from '@/schemas/pharmacyApi'

export const pharmaciesAPI = {
  async list(params?: {
    page?: number
    limit?: number
  }): Promise<PharmaciesPaginatedResponse> {
    const qs = new URLSearchParams()
    if (params?.page != null) qs.set('page', String(params.page))
    if (params?.limit != null) qs.set('limit', String(params.limit))
    const query = qs.toString()
    const raw = await request(`/v1/pharmacies${query ? `?${query}` : ''}`)
    return pharmaciesPaginatedResponseSchema.parse(raw)
  },
}
