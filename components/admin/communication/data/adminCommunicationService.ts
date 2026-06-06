import {
  createAdminCommunicationTaskFromApi,
  fetchAdminCommunicationDashboardFromApi,
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
