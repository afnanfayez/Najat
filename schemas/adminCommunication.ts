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
  broadcast: AdminCommunicationBroadcastData
  feedback: AdminCommunicationFeedbackData
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

export type AdminCommunicationAlertType =
  | 'emergency'
  | 'service_update'
  | 'immediate'
  | 'scheduled'

export interface AdminCommunicationBroadcastStats {
  totalReach: string
  responseRate: string
  networkEfficiency: number
  networkEfficiencyLabel: string
}

export interface AdminCommunicationBroadcastHistoryItem {
  id: string
  timeLabel: string
  tagLabel: string
  tagTone: 'emergency' | 'service'
  title: string
  reach: string
  openRate: string
  confirmations: string
}

export interface AdminCommunicationBroadcastData {
  stats: AdminCommunicationBroadcastStats
  history: AdminCommunicationBroadcastHistoryItem[]
}

export interface LaunchAdminCommunicationBroadcastBody {
  alertType: AdminCommunicationAlertType
  title: string
  description: string
  geographicScope: string
  beneficiarySegment: string
}

export interface AdminCommunicationFeedbackSummary {
  totalReach: string
  generalPulse: string
}

export interface AdminCommunicationLiveIndicator {
  id: string
  title: string
  participationsLabel: string
  progress: number
}

export interface AdminCommunicationWordCloud {
  tags: string[]
  weeklyChangeRate: number
}

export type AdminCommunicationFeedbackFilter = 'latest' | 'priority'

export interface AdminCommunicationFeedbackItem {
  id: string
  authorName: string
  authorMeta: string
  priorityLabel: string
  content: string
  createdAt: number
  priorityRank: number
}

export interface AdminCommunicationFeedbackData {
  summary: AdminCommunicationFeedbackSummary
  liveIndicators: AdminCommunicationLiveIndicator[]
  wordCloud: AdminCommunicationWordCloud
  feedbackItems: AdminCommunicationFeedbackItem[]
}
