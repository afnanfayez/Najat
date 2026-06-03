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
