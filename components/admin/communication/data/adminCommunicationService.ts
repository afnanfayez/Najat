import { toast } from 'sonner'
import {
  createAdminCommunicationTaskFromApi,
  exportAdminCommunicationBroadcastDataFromApi,
  exportAdminCommunicationFeedbackReportsFromApi,
  fetchAdminCommunicationDashboardFromApi,
  launchAdminCommunicationBroadcastFromApi,
} from '@/lib/api/adminCommunication'
import { enqueueOfflineOp } from '@/lib/offline/db'
import type {
  AdminCommunicationDashboard,
  AdminCommunicationPriorityFilter,
  AdminCommunicationRegionFilter,
  AdminCommunicationTask,
  AdminCommunicationVolunteerFilter,
  AdminCommunicationVolunteerOption,
  CreateAdminCommunicationTaskBody,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'

function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function fetchAdminCommunicationDashboard(): Promise<AdminCommunicationDashboard> {
  return fetchAdminCommunicationDashboardFromApi()
}

export function getAdminCommunicationVolunteers(): AdminCommunicationVolunteerOption[] {
  return []
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
  if (isOffline()) {
    await enqueueOfflineOp({ type: 'CREATE_COMMUNICATION_TASK', payload: { body } })
    toast.info('ستُعيَّن المهمة عند عودة الاتصال', { duration: 4000 })
    return fetchAdminCommunicationDashboardFromApi()
  }
  return createAdminCommunicationTaskFromApi(body)
}

export async function launchAdminCommunicationBroadcast(
  body: LaunchAdminCommunicationBroadcastBody
): Promise<AdminCommunicationDashboard> {
  if (isOffline()) {
    await enqueueOfflineOp({ type: 'LAUNCH_COMMUNICATION_BROADCAST', payload: { body } })
    toast.info('سيُطلَق البث الجماعي عند عودة الاتصال', { duration: 4000 })
    return fetchAdminCommunicationDashboardFromApi()
  }
  return launchAdminCommunicationBroadcastFromApi(body)
}

export async function exportAdminCommunicationBroadcastData(): Promise<void> {
  const blob = await exportAdminCommunicationBroadcastDataFromApi()
  downloadBlob(blob, 'broadcast-export.json')
}

export async function exportAdminCommunicationFeedbackReports(): Promise<void> {
  const blob = await exportAdminCommunicationFeedbackReportsFromApi()
  downloadBlob(blob, 'feedback-reports.json')
}
