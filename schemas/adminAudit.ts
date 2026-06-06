export type AdminAuditFilterTab = 'all' | 'under_review' | 'archived'

export type AdminAuditPriorityFilter = 'all' | 'urgent' | 'normal'

export type AdminAuditClassificationFilter = 'all' | 'medical' | 'logistics'

export type AdminAuditReportStatus = 'under_review' | 'archived' | 'resolved'

export type AdminAuditPriority = 'urgent' | 'normal'

export type AdminAuditClassification = 'medical' | 'logistics'

export interface AdminAuditStats {
  totalReports: number
  resolvedWeekly: number
  pendingUrgent: number
  pointsSpent: number
}

export interface AdminAuditReport {
  id: string
  facilityName: string
  issueType: string
  classification: AdminAuditClassification
  priority: AdminAuditPriority
  status: AdminAuditReportStatus
  targetLocation: string
  reporter: string
  reportDate: string
  reviewer?: string
  isUrgent: boolean
  filterTab: Exclude<AdminAuditFilterTab, 'all'>
}

export interface AdminAuditDashboard {
  stats: AdminAuditStats
  reports: AdminAuditReport[]
}

export interface UpdateAdminAuditReportBody {
  issueType?: string
  targetLocation?: string
  reporter?: string
  reportDate?: string
  facilityName?: string
}

export type AdminAuditChangeStatus = 'modified' | 'unchanged' | 'changed'

export type AdminAuditValueTone = 'success' | 'warning' | 'neutral'

export interface AdminAuditCompareField {
  id: string
  title: string
  changeStatus: AdminAuditChangeStatus
  type: 'text' | 'images'
  previousLabel: string
  currentLabel: string
  previousValue: string
  currentValue: string
  previousTone: AdminAuditValueTone
  currentTone: AdminAuditValueTone
  previousImageCaption?: string
  currentImageCaption?: string
  previousImageUrl?: string
  currentImageUrl?: string
}

export interface AdminAuditCompareDetail {
  id: string
  reportId: string
  title: string
  subtitle: string
  changes: AdminAuditCompareField[]
  recoveryBullets: string[]
  recoveryWarning: string
  recoveryFooterNote?: string
  versions: AdminAuditVersionEntry[]
}

export type AdminAuditVersionBadgeTone = 'current' | 'previous' | 'archive'

export interface AdminAuditVersionEntry {
  id: string
  badge: string
  badgeTone: AdminAuditVersionBadgeTone
  timestamp: string
  versionCode: string
  changedBy: string
}
