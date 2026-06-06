export const ADMIN_SECURITY_BLUE = '#2196F3'
export const ADMIN_SECURITY_FONT = "'Cairo', sans-serif"
export const ADMIN_SECURITY_CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.06)'
export const ADMIN_SECURITY_INPUT_BG = '#2196F31A'

export const ADMIN_SECURITY_CARD_SHELL =
  'rounded-xl border border-[#E8EEF5] bg-white p-4 sm:p-5'

export const ADMIN_SECURITY_PAGE = 'min-w-0 w-full max-w-full overflow-x-hidden'

export const ADMIN_SECURITY_SPLIT_GRID =
  'grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:items-stretch'

export const ADMIN_SECURITY_MAIN_COL = 'min-w-0 order-1 lg:col-span-8'

export const ADMIN_SECURITY_SIDE_COL = 'min-w-0 order-2 lg:col-span-4'

export const ADMIN_SECURITY_BOTTOM_MAIN_COL = 'min-w-0 order-1 lg:col-span-7'

export const ADMIN_SECURITY_BOTTOM_SIDE_COL = 'min-w-0 order-2 lg:col-span-5'

export const ADMIN_SECURITY_TAB_META: Record<
  'backup' | 'security',
  { title: string; subtitle: string }
> = {
  backup: {
    title: 'مركز النسخ الاحتياطي والاستعادة',
    subtitle: 'إدارة النسخ الاحتياطي واستعادة النظام لضمان استمرارية الخدمة',
  },
  security: {
    title: 'التحكم الأمني',
    subtitle: 'أذونات النظام وبروتوكولات التشفير الشاملة',
  },
}

export const ADMIN_SECURITY_AUDIT_STATUS = {
  verified: { bg: '#E8F5E9', text: '#22C55E' },
  pending: { bg: '#FFF3E0', text: '#F97316' },
} as const

export const ADMIN_SECURITY_PROTOCOL_STATUS = {
  active: { bg: '#E8F5E9', text: '#22C55E' },
  inactive: { bg: '#F1F5F9', text: '#94A3B8' },
} as const
