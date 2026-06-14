import { request } from '@/lib/api/api'
import type {
  AdminCommunicationDashboard,
  CreateAdminCommunicationTaskBody,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'
import { ADMIN_COMMUNICATION_DASHBOARD } from '@/lib/mocks/adminCommunicationMockData'

const V1 = '/v1/admin/communication'

interface ApiCommunicationDashboard {
  tasks?: {
    total?: number
    pending?: number
    inProgress?: number
    completed?: number
  }
  totalBroadcasts?: number
  totalFeedback?: number
}

function unwrap<T>(raw: unknown): T {
  if (!raw || typeof raw !== 'object') return raw as T
  const obj = raw as Record<string, unknown>
  if (obj.data != null) return unwrap<T>(obj.data)
  return raw as T
}

function adaptCommunicationDashboard(raw: ApiCommunicationDashboard): AdminCommunicationDashboard {
  const tasks = raw.tasks ?? {}
  const mock = ADMIN_COMMUNICATION_DASHBOARD
  return {
    stats: {
      activeInProgress: tasks.inProgress ?? 0,
      criticalCases: tasks.pending ?? 0,
      completedLast24h: tasks.completed ?? 0,
    },
    tasks: mock.tasks,
    performanceWeekly: mock.performanceWeekly,
    performanceMonthly: mock.performanceMonthly,
    systemResilience: mock.systemResilience,
    broadcast: {
      stats: {
        totalReach: raw.totalBroadcasts != null ? String(raw.totalBroadcasts) : mock.broadcast.stats.totalReach,
        responseRate: mock.broadcast.stats.responseRate,
        networkEfficiency: mock.broadcast.stats.networkEfficiency,
        networkEfficiencyLabel: mock.broadcast.stats.networkEfficiencyLabel,
      },
      history: mock.broadcast.history,
    },
    feedback: {
      summary: {
        totalReach: raw.totalFeedback != null ? String(raw.totalFeedback) : mock.feedback.summary.totalReach,
        generalPulse: mock.feedback.summary.generalPulse,
      },
      liveIndicators: mock.feedback.liveIndicators,
      wordCloud: mock.feedback.wordCloud,
      feedbackItems: mock.feedback.feedbackItems,
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
