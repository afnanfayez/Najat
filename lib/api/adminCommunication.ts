import { request } from '@/lib/api/api'
import type {
  AdminCommunicationDashboard,
  CreateAdminCommunicationTaskBody,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'

const V1 = '/v1/admin/communication'

interface ApiCommunicationDashboard {
  pendingTasksCount?: number
  inProgressTasksCount?: number
  completedTasksCount?: number
  totalBroadcastsSent?: number
  feedbackEntriesCount?: number
}

function unwrap<T>(raw: unknown): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (obj.data != null) return unwrap<T>(obj.data)
  return raw as T
}

function adaptCommunicationDashboard(raw: ApiCommunicationDashboard): AdminCommunicationDashboard {
  return {
    stats: {
      activeInProgress: raw.inProgressTasksCount ?? 0,
      criticalCases: raw.pendingTasksCount ?? 0,
      completedLast24h: raw.completedTasksCount ?? 0,
    },
    tasks: [],
    performanceWeekly: [],
    performanceMonthly: [],
    systemResilience: {
      statusLabel: 'متصل',
      title: 'النظام يعمل',
      message: 'جميع الخدمات تعمل بشكل طبيعي',
      lastCheckLabel: 'آخر فحص',
      lastCheckAgo: 'الآن',
    },
    broadcast: {
      stats: {
        totalReach: String(raw.totalBroadcastsSent ?? 0),
        responseRate: '—',
        networkEfficiency: 0,
        networkEfficiencyLabel: '—',
      },
      history: [],
    },
    feedback: {
      summary: {
        totalReach: String(raw.feedbackEntriesCount ?? 0),
        generalPulse: '—',
      },
      liveIndicators: [],
      wordCloud: { tags: [], weeklyChangeRate: 0 },
      feedbackItems: [],
    },
  }
}

export async function fetchAdminCommunicationDashboardFromApi(): Promise<AdminCommunicationDashboard> {
  const response = await request(`${V1}/dashboard`, { method: 'GET' })
  const raw = unwrap<ApiCommunicationDashboard>(response)
  return adaptCommunicationDashboard(raw)
}

export async function createAdminCommunicationTaskFromApi(
  body: CreateAdminCommunicationTaskBody
): Promise<AdminCommunicationDashboard> {
  await request(`${V1}/tasks`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return fetchAdminCommunicationDashboardFromApi()
}

export async function launchAdminCommunicationBroadcastFromApi(
  body: LaunchAdminCommunicationBroadcastBody
): Promise<AdminCommunicationDashboard> {
  await request(`${V1}/broadcasts`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return fetchAdminCommunicationDashboardFromApi()
}

export async function exportAdminCommunicationBroadcastDataFromApi(): Promise<Blob> {
  const response = await request(`${V1}/broadcasts/export`, { method: 'GET' })
  if (response instanceof Blob) return response
  return new Blob([JSON.stringify(response)], { type: 'application/json' })
}

export async function exportAdminCommunicationFeedbackReportsFromApi(): Promise<Blob> {
  const response = await request(`${V1}/feedback/export`, { method: 'GET' })
  if (response instanceof Blob) return response
  return new Blob([JSON.stringify(response)], { type: 'application/json' })
}
