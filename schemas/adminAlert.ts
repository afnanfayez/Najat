export type AdminAlertPriority = 'very_urgent' | 'help_request'

/** شكل البيانات القادمة من الباك اند */
export type AdminAlertDto = {
  id: string
  title: string
  location: string
  priority: AdminAlertPriority
  /** وقت نسبي جاهز للعرض أو ISO date من API */
  reportedAt: string
  lat: number
  lng: number
}

/** نموذج العرض بعد التحويل في الواجهة */
export type AdminManagedAlert = AdminAlertDto & {
  time: string
  accentColor: string
  badgeLabel: string
}

export type AdminAlertsTab = 'all' | 'very_urgent' | 'help_request'

export type AdminAlertsListResponse = {
  alerts: AdminAlertDto[]
  mapCenter?: { lat: number; lng: number }
}
