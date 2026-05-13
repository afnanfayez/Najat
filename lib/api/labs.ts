import { request } from '@/lib/api/api'
import {
  labsPaginatedResponseSchema,
  type LabsPaginatedResponse,
} from '@/schemas/labApi'

export const labsAPI = {
  async list(params?: {
    page?: number
    limit?: number
  }): Promise<LabsPaginatedResponse> {
    const qs = new URLSearchParams()
    if (params?.page != null) qs.set('page', String(params.page))
    if (params?.limit != null) qs.set('limit', String(params.limit))
    const query = qs.toString()
    const raw = await request(`/v1/labs${query ? `?${query}` : ''}`)
    return labsPaginatedResponseSchema.parse(raw)
  },
}
