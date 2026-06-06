import { request } from '@/lib/api/api'
import type {
  AdminCommunicationDashboard,
  CreateAdminCommunicationTaskBody,
} from '@/schemas/adminCommunication'

const V1 = '/v1/admin/communication'

function unwrap<T>(raw: unknown, key?: string): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (key && obj[key] != null) return obj[key] as T
  if (obj.data != null) return unwrap<T>(obj.data, key)
  return raw as T
}

export async function fetchAdminCommunicationDashboardFromApi(): Promise<AdminCommunicationDashboard> {
  const response = await request(`${V1}/dashboard`, { method: 'GET' })
  return unwrap<AdminCommunicationDashboard>(response, 'dashboard')
}

export async function createAdminCommunicationTaskFromApi(
  body: CreateAdminCommunicationTaskBody
): Promise<AdminCommunicationDashboard> {
  const response = await request(`${V1}/tasks`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return unwrap<AdminCommunicationDashboard>(response, 'dashboard')
}
