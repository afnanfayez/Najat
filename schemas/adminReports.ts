export type AdminReportsTab = 'statistical' | 'operations'

export interface AdminReportsKpi {
  id: string
  label: string
  value: string
  tag?: string
}

export interface AdminReportsRegionalPoint {
  region: string
  value: number
}

export interface AdminReportsResourceSegment {
  label: string
  percent: number
  color: string
}

export interface AdminReportsResponsePoint {
  month: string
  value: number
}

export type AdminReportsNeedLevelTone = 'critical' | 'stable' | 'medium'

export interface AdminReportsNeedRegion {
  id: string
  name: string
  level: string
  levelTone: AdminReportsNeedLevelTone
  percent: number
}

export interface AdminReportsInsight {
  title: string
  body: string
  actionLabel: string
}

export interface AdminReportsRegionalDistribution {
  title: string
  subtitle: string
  periodTag: string
  points: AdminReportsRegionalPoint[]
}

export interface AdminReportsResourceBreakdown {
  segments: AdminReportsResourceSegment[]
  totalLabel: string
  totalValue: string
}

export interface AdminReportsResponseTime {
  title: string
  volunteers: AdminReportsResponsePoint[]
  beneficiaries: AdminReportsResponsePoint[]
}

export interface AdminReportsNeedyRegions {
  title: string
  regions: AdminReportsNeedRegion[]
}

export interface AdminReportsStatisticalData {
  kpis: AdminReportsKpi[]
  regionalDistribution: AdminReportsRegionalDistribution
  resourceBreakdown: AdminReportsResourceBreakdown
  responseTime: AdminReportsResponseTime
  needyRegions: AdminReportsNeedyRegions
  insight: AdminReportsInsight
}

export interface AdminReportsActiveRegion {
  id: string
  name: string
  percent: number
}

export interface AdminReportsActiveRegions {
  title: string
  subtitle: string
  mapActionLabel: string
  regions: AdminReportsActiveRegion[]
}

export interface AdminReportsQualityGauge {
  id: string
  value: number
  label: string
  description: string
  color: string
}

export interface AdminReportsDataQuality {
  title: string
  subtitle: string
  gauges: AdminReportsQualityGauge[]
}

export interface AdminReportsOperationsData {
  kpis: AdminReportsKpi[]
  activityBreakdown: AdminReportsResourceBreakdown
  activeRegions: AdminReportsActiveRegions
  dataQuality: AdminReportsDataQuality
}

export interface AdminReportsDashboard {
  statistical: AdminReportsStatisticalData
  operations: AdminReportsOperationsData
}
