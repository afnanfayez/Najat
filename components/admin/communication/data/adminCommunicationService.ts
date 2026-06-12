import {
  createAdminCommunicationTaskFromApi,
  exportAdminCommunicationBroadcastDataFromApi,
  exportAdminCommunicationFeedbackReportsFromApi,
  fetchAdminCommunicationDashboardFromApi,
  launchAdminCommunicationBroadcastFromApi,
} from '@/lib/api/adminCommunication'
import {
  ADMIN_COMMUNICATION_DASHBOARD,
  ADMIN_COMMUNICATION_VOLUNTEERS,
} from '@/lib/mocks/adminCommunicationMockData'
import { USE_MOCK_ADMIN_COMMUNICATION } from '@/lib/mocks/mockConfig'
import type {
  AdminCommunicationDashboard,
  AdminCommunicationPriorityFilter,
  AdminCommunicationRegionFilter,
  AdminCommunicationTask,
  AdminCommunicationVolunteerFilter,
  CreateAdminCommunicationTaskBody,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let mockStore: AdminCommunicationDashboard | null = null

function cloneDashboard(data: AdminCommunicationDashboard): AdminCommunicationDashboard {
  return structuredClone(data)
}

function getMockStore(): AdminCommunicationDashboard {
  if (!mockStore) {
    mockStore = cloneDashboard(ADMIN_COMMUNICATION_DASHBOARD)
  }
  return mockStore
}

const BADGE_BY_PRIORITY = {
  urgent: { badgeTone: 'critical' as const, badgeLabel: 'شديد الأهمية' },
  normal: { badgeTone: 'active' as const, badgeLabel: 'نشط' },
  low: { badgeTone: 'normal' as const, badgeLabel: 'عادي' },
}

export async function fetchAdminCommunicationDashboard(): Promise<AdminCommunicationDashboard> {
  if (!USE_MOCK_ADMIN_COMMUNICATION) {
    // TODO: Wire real API when backend adds /v1/admin/communication/* endpoints.
    // Remove NEXT_PUBLIC_ADMIN_COMMUNICATION_MOCK=1 from .env when the endpoint is live.
    return fetchAdminCommunicationDashboardFromApi()
  }
  await delay()
  return cloneDashboard(getMockStore())
}

export function getAdminCommunicationVolunteers() {
  return ADMIN_COMMUNICATION_VOLUNTEERS
}

export function filterAdminCommunicationTasks(
  tasks: AdminCommunicationTask[],
  priority: AdminCommunicationPriorityFilter,
  region: AdminCommunicationRegionFilter,
  volunteer: AdminCommunicationVolunteerFilter
): AdminCommunicationTask[] {
  return tasks.filter((task) => {
    const priorityMatch =
      priority === 'all' ||
      (priority === 'critical' && task.badgeTone === 'critical') ||
      (priority === 'active' && task.badgeTone === 'active') ||
      (priority === 'normal' && task.badgeTone === 'normal') ||
      (priority === 'low' && task.priorityLevel === 'low')
    const regionMatch = region === 'all' || task.region === region
    const volunteerMatch = volunteer === 'all' || task.volunteerId === volunteer
    return priorityMatch && regionMatch && volunteerMatch
  })
}

export async function createAdminCommunicationTask(
  body: CreateAdminCommunicationTaskBody
): Promise<AdminCommunicationDashboard> {
  if (!USE_MOCK_ADMIN_COMMUNICATION) {
    return createAdminCommunicationTaskFromApi(body)
  }
  await delay(400)
  const store = getMockStore()
  const volunteer = ADMIN_COMMUNICATION_VOLUNTEERS.find((v) => v.id === body.volunteerId)
  const badge = BADGE_BY_PRIORITY[body.priority]
  const newTask: AdminCommunicationTask = {
    id: `t${Date.now()}`,
    title: body.title,
    badgeTone: badge.badgeTone,
    badgeLabel: badge.badgeLabel,
    timeLabel: 'تم التعيين للتو',
    assigneeName: volunteer?.name ?? 'غير محدد',
    assigneeRole: 'متطوع',
    assigneeAvatar: '/assets/profile_avatar.png',
    location: '—',
    region: 'غزة',
    volunteerId: body.volunteerId,
    priorityLevel: body.priority,
  }
  store.tasks = [newTask, ...store.tasks]
  store.stats.activeInProgress += 1
  if (body.priority === 'urgent') {
    store.stats.criticalCases += 1
  }
  return cloneDashboard(store)
}

const BROADCAST_TAG_BY_ALERT = {
  emergency: { tagLabel: 'طارئ جداً', tagTone: 'emergency' as const },
  service_update: { tagLabel: 'تحديث خدمي', tagTone: 'service' as const },
  immediate: { tagLabel: 'إرسال فوري', tagTone: 'emergency' as const },
  scheduled: { tagLabel: 'جدولة لاحقاً', tagTone: 'service' as const },
}

export async function launchAdminCommunicationBroadcast(
  body: LaunchAdminCommunicationBroadcastBody
): Promise<AdminCommunicationDashboard> {
  if (!USE_MOCK_ADMIN_COMMUNICATION) {
    return launchAdminCommunicationBroadcastFromApi(body)
  }
  await delay(500)
  const store = getMockStore()
  const tag = BROADCAST_TAG_BY_ALERT[body.alertType]
  const newItem = {
    id: `b${Date.now()}`,
    timeLabel: 'تم الإرسال للتو',
    tagLabel: tag.tagLabel,
    tagTone: tag.tagTone,
    title: body.title,
    reach: '— وصول',
    openRate: '— فتح',
    confirmations: '— تأكيد',
  }
  store.broadcast.history = [newItem, ...store.broadcast.history].slice(0, 10)
  return cloneDashboard(store)
}

export async function exportAdminCommunicationBroadcastData(): Promise<void> {
  if (!USE_MOCK_ADMIN_COMMUNICATION) {
    const blob = await exportAdminCommunicationBroadcastDataFromApi()
    downloadBlob(blob, 'broadcast-export.json')
    return
  }
  await delay(300)
  const store = getMockStore()
  const blob = new Blob([JSON.stringify(store.broadcast, null, 2)], {
    type: 'application/json',
  })
  downloadBlob(blob, 'broadcast-export.json')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function exportAdminCommunicationFeedbackReports(): Promise<void> {
  if (!USE_MOCK_ADMIN_COMMUNICATION) {
    const blob = await exportAdminCommunicationFeedbackReportsFromApi()
    downloadBlob(blob, 'feedback-reports.json')
    return
  }
  await delay(300)
  const store = getMockStore()
  const blob = new Blob([JSON.stringify(store.feedback, null, 2)], {
    type: 'application/json',
  })
  downloadBlob(blob, 'feedback-reports.json')
}
