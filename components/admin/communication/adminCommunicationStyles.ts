export const ADMIN_COMM_BLUE = '#2196F3'
export const ADMIN_COMM_FONT = "'Cairo', sans-serif"
export const ADMIN_COMM_CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.06)'
export const ADMIN_COMM_INPUT_BG = '#2196F31A'

export const ADMIN_COMM_CARD_SHELL =
  'rounded-xl border border-[#E8EEF5] bg-white p-4 sm:p-5'

export const ADMIN_COMM_PAGE = 'min-w-0 w-full max-w-full overflow-x-hidden'

/** Two-column RTL layout: main (8) + sidebar (4) from lg */
export const ADMIN_COMM_SPLIT_GRID =
  'grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:items-stretch'

export const ADMIN_COMM_MAIN_COL = 'min-w-0 order-1 lg:col-span-8'

export const ADMIN_COMM_SIDE_COL =
  'flex min-w-0 flex-col gap-3 sm:gap-4 order-2 lg:col-span-4 lg:h-full'

export const ADMIN_COMM_LABEL_STYLE = {
  fontFamily: ADMIN_COMM_FONT,
  fontWeight: 700,
  fontSize: '14px',
  color: '#1e293b',
} as const

export const ADMIN_COMM_TASK_BADGE = {
  critical: { label: 'شديد الأهمية', color: '#EF4444', bg: '#FEE2E2', dot: '#EF4444' },
  active: { label: 'نشط', color: '#22C55E', bg: '#E8F5E9', dot: '#22C55E' },
  normal: { label: 'عادي', color: '#64748B', bg: '#F1F5F9', dot: '#94A3B8' },
} as const

export const ADMIN_COMM_TAB_META: Record<
  'internal_tasks' | 'strategic_broadcast' | 'feedback_analysis',
  { title: string; subtitle: string }
> = {
  internal_tasks: {
    title: 'المهام الداخلية',
    subtitle: 'نظرة استراتيجية على تنسيق العمليات الميدانية',
  },
  strategic_broadcast: {
    title: 'مركز البث الاستراتيجي',
    subtitle:
      'إدارة وتوجيه التنبيهات الحرجة والخدمية عبر الشبكة الوطنية الموحدة.',
  },
  feedback_analysis: {
    title: 'مركز تحليل الملاحظات',
    subtitle:
      'محرك التحليلات الذكي لقياس جودة الاستجابة الإنسانية وتجربة المستخدمين',
  },
}
