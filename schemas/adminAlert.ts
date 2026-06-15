/** Severity levels returned by AdminAlertEntity */
export type AdminAlertSeverity = 'critical' | 'warning' | string

/** Source categories returned by AdminAlertEntity */
export type AdminAlertSource = 'system' | 'sync' | 'user_report' | string

/** Matches AdminAlertEntity from the API */
export type AdminAlertDto = {
  id: string
  title: string
  /** Full description / message body of the alert */
  message: string
  severity: AdminAlertSeverity
  source: AdminAlertSource
  isResolved: boolean
  createdAt?: string
  updatedAt?: string
}

/** UI-enriched alert with derived display fields */
export type AdminManagedAlert = AdminAlertDto & {
  /** Formatted time string derived from createdAt */
  time: string
  /** Hex color for the badge, derived from severity */
  accentColor: string
  /** Arabic label for the badge, derived from severity */
  badgeLabel: string
  /** Arabic label for the source type */
  sourceLabel: string
}

/** Tab IDs — 'very_urgent' maps to severity=critical, 'help_request' maps to source=user_report */
export type AdminAlertsTab = 'all' | 'very_urgent' | 'help_request'

export type AdminAlertsListResponse = {
  alerts: AdminAlertDto[]
  mapCenter?: { lat: number; lng: number }
}
