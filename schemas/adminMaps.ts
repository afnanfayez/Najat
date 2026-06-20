export type MapPublishStatus = 'published' | 'processing' | 'failed'

export type MapRouteClassification = 'safe' | 'danger' | 'alternative'
export type MapRouteOperationalStatus = 'open' | 'maintenance' | 'closed'

export interface AdminMapsPackageSizes {
  baseMapSizeMb: number
  differentialDataMb: number
  changeRateNote: string
}

export interface AdminMapsSyncSegment {
  label: string
  percent: number
  color: string
}

export interface AdminMapsIntegrity {
  activePackage: string
  lastSyncAgo: string
  inspectionPoints: number
  syncPercent: number
  syncSegments: AdminMapsSyncSegment[]
}

export interface AdminMapsPublishLog {
  id: string
  geographicScope: string
  publishedAt: string
  deviceCount: number | null
  changeImpact: string
  status: MapPublishStatus
  classification?: MapRouteClassification
  operationalStatus?: MapRouteOperationalStatus
  /** Safe-road path (lat,lng) — only present when classification is 'safe'. Needed
   *  to recreate the road on rename, since the backend has no update endpoint for it. */
  positions?: [number, number][]
  /** Resource-point location (lat,lng) — only present when classification is 'alternative'.
   *  Needed to recreate the point on rename, since the backend has no update endpoint for it. */
  position?: [number, number]
}

export interface AdminMapsInsight {
  id: string
  title: string
  description: string
  variant?: 'default' | 'warning'
}

export interface AdminMapsDashboard {
  sizes: AdminMapsPackageSizes
  integrity: AdminMapsIntegrity
  publishLogs: AdminMapsPublishLog[]
  insights: AdminMapsInsight[]
}

export type AdminMapsVerificationTagVariant = 'danger' | 'warning'

export interface AdminMapsVerificationRequest {
  id: string
  tag: string
  tagVariant: AdminMapsVerificationTagVariant
  title: string
  description: string
  lat?: number
  lng?: number
}

export interface AdminMapsFieldReport {
  id: string
  author: string
  time: string
  message: string
}

export type AdminMapsQuickActionType = 'update' | 'delete' | 'add'

export interface AdminMapsQuickAction {
  id: string
  type: AdminMapsQuickActionType
  message: string
}

export interface AdminMapsEditorLayer {
  id: string
  label: string
  color: string
  active: boolean
}

export interface AdminMapsEditorIntegrity {
  fieldDataAccuracy: number
  lastUpdateMinutes: number
}

export interface AdminMapsPackageEditorData {
  verificationRequests: AdminMapsVerificationRequest[]
  fieldReports: AdminMapsFieldReport[]
  quickActions: AdminMapsQuickAction[]
  layers: AdminMapsEditorLayer[]
  integrity: AdminMapsEditorIntegrity
}
