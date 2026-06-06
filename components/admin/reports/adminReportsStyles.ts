export const ADMIN_REPORTS_BLUE = '#2196F3'
export const ADMIN_REPORTS_FONT = "'Cairo', sans-serif"
export const ADMIN_REPORTS_CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.06)'
export const ADMIN_REPORTS_INPUT_BG = '#2196F31A'

export const ADMIN_REPORTS_CARD_SHELL =
  'rounded-xl border border-[#E8EEF5] bg-white p-4 sm:p-5'

export const ADMIN_REPORTS_PAGE = 'min-w-0 w-full max-w-full overflow-x-hidden'

export const ADMIN_REPORTS_SPLIT_GRID =
  'grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:items-stretch'

export const ADMIN_REPORTS_NEED_LEVEL = {
  critical: { bar: '#EF4444', text: '#EF4444', bg: '#FEE2E2' },
  stable: { bar: '#22C55E', text: '#22C55E', bg: '#E8F5E9' },
  medium: { bar: '#F97316', text: '#F97316', bg: '#FFF3E0' },
} as const

export const ADMIN_REPORTS_TAB_META: Record<
  'statistical' | 'operations',
  { title: string; subtitle: string }
> = {
  statistical: {
    title: 'التقارير الإحصائية',
    subtitle: 'عرض تحليلي شامل للموارد والعمليات الإنسانية في الميدان',
  },
  operations: {
    title: 'تقارير العمليات التشغيلية',
    subtitle: 'متابعة الأداء الميداني وجودة البيانات اللحظية',
  },
}
