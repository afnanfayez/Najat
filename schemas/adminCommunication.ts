export type AdminCommunicationTab =
  | 'internal_tasks'
  | 'strategic_broadcast'
  | 'feedback_analysis'

export type AdminCommunicationPriorityFilter =
  | 'all'
  | 'critical'
  | 'active'
  | 'normal'
  | 'low'

export type AdminCommunicationRegionFilter = 'all' | string
export type AdminCommunicationVolunteerFilter = 'all' | string

export type AdminCommunicationTaskPriority = 'urgent' | 'normal' | 'low'

export type AdminCommunicationTaskBadgeTone = 'critical' | 'active' | 'normal'

export interface AdminCommunicationStats {
  activeInProgress: number
  criticalCases: number
  completedLast24h: number
}

export interface AdminCommunicationTask {
  id: string
  title: string
  badgeTone: AdminCommunicationTaskBadgeTone
  badgeLabel: string
  timeLabel: string
  assigneeName: string
  assigneeRole: string
  assigneeAvatar: string
  location: string
  region: string
  volunteerId: string
  priorityLevel: AdminCommunicationTaskPriority
}

export interface AdminCommunicationPerformancePoint {
  day: string
  value: number
}

export interface AdminCommunicationSystemResilience {
  statusLabel: string
  title: string
  message: string
  lastCheckLabel: string
  lastCheckAgo: string
}

export interface AdminCommunicationDashboard {
  stats: AdminCommunicationStats
  tasks: AdminCommunicationTask[]
  performanceWeekly: AdminCommunicationPerformancePoint[]
  performanceMonthly: AdminCommunicationPerformancePoint[]
  systemResilience: AdminCommunicationSystemResilience
}

export interface CreateAdminCommunicationTaskBody {
  title: string
  description: string
  volunteerId: string
  priority: AdminCommunicationTaskPriority
  dueDate: string
  dueTime: string
}

export interface AdminCommunicationVolunteerOption {
  id: string
  name: string
}
