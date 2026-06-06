export type AdminDataFilterTab = 'all' | 'under_review' | 'reviewed' | 'published'

export type AdminDataRequestStatus =
  | 'under_review'
  | 'pending_review'
  | 'published'
  | 'rejected'

export interface AdminDataStats {
  pendingReview: number
  publishedToday: number
  rejectedRequests: number
  activeVolunteers: number
}

export interface AdminDataRequest {
  id: string
  title: string
  subtitle: string
  description: string
  status: AdminDataRequestStatus
  volunteerName: string
  submittedAt: string
  filterTab: Exclude<AdminDataFilterTab, 'all'>
}

export interface AdminDataDashboard {
  stats: AdminDataStats
  requests: AdminDataRequest[]
}

export type AdminDataReviewDecision = 'approve' | 'needs_review' | 'reject'

export interface AdminDataAuditEntry {
  id: string
  message: string
  actor: string
  time: string
}

export interface AdminDataInventoryItem {
  id: string
  label: string
  percent: number
  variant: 'success' | 'danger'
}

export interface AdminDataReviewDetail {
  id: string
  requestCode: string
  title: string
  submittedAgo: string
  facilityName: string
  facilityType: string
  location: string
  lastFieldUpdate: string
  isOpen: boolean
  inventory: AdminDataInventoryItem[]
  services: string[]
  sourceNotes: string
  auditLog: AdminDataAuditEntry[]
}

export type AdminDataSyncPriority = 'very_high' | 'medium' | 'low'

export interface AdminDataSyncRequest {
  id: string
  code: string
  location: string
  dataType: string
  acceptedAt: string
  priority: AdminDataSyncPriority
}

export interface AdminDataSyncStatus {
  lastSyncAgo: string
  successRate: number
  queueCount: number
}

export interface AdminDataActivityEntry {
  id: string
  actor: string
  action: string
  timeAgo: string
}

export interface AdminDataSyncDashboard {
  syncStatus: AdminDataSyncStatus
  acceptedRequests: AdminDataSyncRequest[]
  activityLog: AdminDataActivityEntry[]
}

/** معاملات جلب لوحة البيانات — يُمرَّر filter للباك عند التفعيل */
export interface AdminDataDashboardQueryParams {
  filter?: Exclude<AdminDataFilterTab, 'all'>
}

export interface SubmitAdminDataReviewBody {
  decision: AdminDataReviewDecision
  notes: string
}

export type AdminDataReviewSubmitMode = 'draft' | 'publish'
