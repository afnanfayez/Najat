import type { AdminAlertDto, AdminAlertsTab } from '@/schemas/adminAlert'
import { USE_MOCK_ADMIN_ALERTS } from '@/lib/mocks/mockConfig'

export { USE_MOCK_ADMIN_ALERTS }

export type { AdminAlertsTab }

export const ADMIN_ALERTS_TABS: { id: AdminAlertsTab; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'very_urgent', label: 'عاجل جداً' },
  { id: 'help_request', label: 'طلب مساعدة' },
]

export const ADMIN_ALERTS_MAP_CENTER = {
  lat: 31.512,
  lng: 34.448,
} as const

/** Fallback mock alerts matching the actual AdminAlertEntity API shape */
export const ADMIN_ALERTS_MOCK: AdminAlertDto[] = [
  {
    id: '1',
    title: 'حريق في مبنى سكني',
    message: 'حي الرمال، جامع الكنز',
    severity: 'critical',
    source: 'user_report',
    isResolved: false,
  },
  {
    id: '2',
    title: 'إصابة خطيرة',
    message: 'شارع النصيرات',
    severity: 'critical',
    source: 'user_report',
    isResolved: false,
  },
  {
    id: '3',
    title: 'طلب لوجستي',
    message: 'مخيم السلام',
    severity: 'warning',
    source: 'system',
    isResolved: false,
  },
]

export function getMockAdminAlertsList(): AdminAlertDto[] {
  return ADMIN_ALERTS_MOCK
}
