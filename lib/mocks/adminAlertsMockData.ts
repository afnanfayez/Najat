import type { AdminAlertDto, AdminAlertsTab } from '@/schemas/adminAlert'
import { USE_MOCK_ADMIN_ALERTS } from '@/lib/mocks/mockConfig'

export { USE_MOCK_ADMIN_ALERTS }

export type { AdminAlertsTab }

export const ADMIN_ALERT_PRIORITY_COLORS = {
  very_urgent: '#F44336',
  help_request: '#FF9800',
} as const

export const ADMIN_ALERT_PRIORITY_LABELS: Record<
  AdminAlertDto['priority'],
  string
> = {
  very_urgent: 'عاجل جداً',
  help_request: 'طلب مساعدة',
}

export const ADMIN_ALERTS_MOCK: AdminAlertDto[] = [
  {
    id: '1',
    title: 'حريق في مبنى سكني',
    location: 'حي الرمال، جامع الكنز',
    priority: 'very_urgent',
    reportedAt: 'منذ 5 دقائق',
    lat: 31.518,
    lng: 34.452,
  },
  {
    id: '2',
    title: 'إصابة خطيرة',
    location: 'شارع النصيرات',
    priority: 'very_urgent',
    reportedAt: 'منذ 12 دقيقة',
    lat: 31.512,
    lng: 34.438,
  },
  {
    id: '3',
    title: 'طلب لوجستي',
    location: 'مخيم السلام',
    priority: 'help_request',
    reportedAt: 'منذ 30 دقيقة',
    lat: 31.505,
    lng: 34.461,
  },
]

export const ADMIN_ALERTS_TABS: { id: AdminAlertsTab; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'very_urgent', label: 'عاجل جداً' },
  { id: 'help_request', label: 'طلب مساعدة' },
]

export const ADMIN_ALERTS_MAP_CENTER = {
  lat: 31.512,
  lng: 34.448,
} as const

export function getMockAdminAlertsList(): AdminAlertDto[] {
  return ADMIN_ALERTS_MOCK
}
