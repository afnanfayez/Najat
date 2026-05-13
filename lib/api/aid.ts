import { request } from '@/lib/api/api'
import {
  aidsPaginatedResponseSchema,
  aidByIdResponseSchema,
  type AidsPaginatedResponse,
  type AidDto,
} from '@/schemas/aidApi'

export const aidAPI = {
  async list(params?: {
    page?: number
    limit?: number
  }): Promise<AidsPaginatedResponse> {
    const qs = new URLSearchParams()
    if (params?.page != null) qs.set('page', String(params.page))
    if (params?.limit != null) qs.set('limit', String(params.limit))
    const query = qs.toString()
    const raw = await request(`/v1/aid${query ? `?${query}` : ''}`)
    return aidsPaginatedResponseSchema.parse(raw)
  },

  async getById(id: string): Promise<AidDto> {
    const raw = await request(`/v1/aid/${id}`)
    return aidByIdResponseSchema.parse(raw).data
  },
}
