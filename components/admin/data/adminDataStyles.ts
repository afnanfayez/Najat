export const ADMIN_DATA_BLUE = '#2196F3'
export const ADMIN_DATA_FONT = "'Cairo', sans-serif"
export const ADMIN_DATA_CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.06)'
export const ADMIN_DATA_INPUT_BG = '#2196F31A'

/** Shared card shell — consistent padding across breakpoints */
export const ADMIN_DATA_CARD_SHELL =
  'rounded-xl border border-[#E8EEF5] bg-white p-4 sm:p-5'

/** Page / section wrappers — prevent horizontal overflow */
export const ADMIN_DATA_PAGE = 'min-w-0 w-full max-w-full'

export const ADMIN_DATA_SECTION_STACK = 'flex min-w-0 flex-col gap-3 sm:gap-4'

export const ADMIN_DATA_REQUESTS_GRID =
  'grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'

export const ADMIN_DATA_STATUS_LABELS = {
  under_review: { label: 'تحت المراجعة', color: '#2196F3', bg: '#E3F2FD', dot: '#2196F3' },
  pending_review: { label: 'قيد المراجعة', color: '#FF9800', bg: '#FFF3E0', dot: '#FF9800' },
  published: { label: 'تم النشر', color: '#4CAF50', bg: '#E8F5E9', dot: '#4CAF50' },
  rejected: { label: 'مرفوض', color: '#EF4444', bg: '#FEE2E2', dot: '#EF4444' },
} as const

export const ADMIN_DATA_PRIORITY_LABELS = {
  very_high: { label: 'عالية جداً', color: '#EF4444', bg: '#FEE2E2' },
  medium: { label: 'متوسطة', color: '#FF9800', bg: '#FFF3E0' },
  low: { label: 'منخفضة', color: '#5C6BC0', bg: '#E8EAF6' },
} as const
