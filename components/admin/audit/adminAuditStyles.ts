export const ADMIN_AUDIT_BLUE = '#2196F3'
export const ADMIN_AUDIT_FONT = "'Cairo', sans-serif"
export const ADMIN_AUDIT_CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.06)'
export const ADMIN_AUDIT_INPUT_BG = '#2196F31A'

export const ADMIN_AUDIT_CARD_SHELL =
  'rounded-xl border border-[#E8EEF5] bg-white p-4 sm:p-5'

export const ADMIN_AUDIT_STATUS_LABELS = {
  under_review: { label: 'قيد المراجعة', color: '#FF9800', bg: '#FFF3E0' },
  archived: { label: 'مؤرشف', color: '#64748B', bg: '#F1F5F9' },
  resolved: { label: 'تم الحل', color: '#22C55E', bg: '#E8F5E9' },
} as const

export const ADMIN_AUDIT_PRIORITY_LABELS = {
  urgent: { label: 'عاجل', color: '#EF4444', bg: '#FEE2E2' },
  normal: { label: 'عادي', color: '#64748B', bg: '#F1F5F9' },
} as const

export const ADMIN_AUDIT_CLASSIFICATION_LABELS = {
  medical: { label: 'طبي', color: '#2196F3', bg: '#E3F2FD' },
  logistics: { label: 'لوجستي', color: '#7C3AED', bg: '#EDE9FE' },
} as const

export const ADMIN_AUDIT_CHANGE_STATUS_LABELS = {
  modified: { label: 'تم التعديل', color: '#22C55E', bg: '#E8F5E9' },
  unchanged: { label: 'لم يتغير', color: '#64748B', bg: '#F1F5F9' },
  changed: { label: 'تم التغيير', color: '#64748B', bg: '#F1F5F9' },
} as const

export const ADMIN_AUDIT_VALUE_TONES = {
  success: { border: 'transparent', bg: '#E8F5E9', text: '#2E7D32', label: '#43A047' },
  warning: { border: 'transparent', bg: '#FFF3E0', text: '#E65100', label: '#FB8C00' },
  neutral: { border: 'transparent', bg: '#F5F5F5', text: '#616161', label: '#9E9E9E' },
} as const

export const ADMIN_AUDIT_VERSION_BADGE = {
  current: { label: 'الإصدار الحالي', color: '#2196F3', bg: '#E3F2FD' },
  previous: { label: 'السابق', color: '#64748B', bg: '#F1F5F9' },
  archive: { label: 'أرشيف', color: '#94A3B8', bg: '#F8FAFC' },
} as const

export function formatAuditPoints(value: number): string {
  if (value >= 1000) {
    const k = value / 1000
    return Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`
  }
  return value.toLocaleString('en-US')
}
