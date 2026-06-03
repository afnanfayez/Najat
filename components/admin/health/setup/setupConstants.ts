export const FACILITY_REGION_OPTIONS = [
  { value: 'gaza', label: 'غزة' },
  { value: 'north', label: 'شمال قطاع غزة' },
  { value: 'central', label: 'وسط قطاع غزة' },
  { value: 'south', label: 'جنوب قطاع غزة' },
]

export const FACILITY_SERVICES = [
  { id: 'emergency', label: 'الطوارئ 24/7' },
  { id: 'surgery', label: 'الجراحة العامة' },
  { id: 'maternity', label: 'قسم الولادة' },
  { id: 'icu', label: 'العناية المركزة' },
  { id: 'outpatient', label: 'العيادات الخارجية' },
  { id: 'pharmacy', label: 'الصيدلية الداخلية' },
  { id: 'dental', label: 'الأسنان' },
  { id: 'orthopedics', label: 'العظام' },
  { id: 'urology', label: 'المسالك البولية' },
  { id: 'dermatology', label: 'الجلدية والعناية بالبشرة' },
]

/** مركز الخريطة الافتراضي — غزة */
export const DEFAULT_FACILITY_MAP_CENTER: [number, number] = [31.5218, 34.4467]

/** أوقات العمل */
export const WORKING_TIME_SLOTS = [
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
]

export const CALENDAR_MONTH = { year: 2026, month: 5, label: '5/2026' }

/** أيام الأسبوع — مطابق للتصميم (يبدأ من الجمعة) */
export const CALENDAR_WEEKDAYS = ['ج', 'س', 'أ', 'إ', 'ث', 'أ', 'خ']

/** أيام محدّدة في التصميم (مايو 2026) */
export const DEFAULT_SELECTED_CALENDAR_DAYS = [
  1, 2, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 26, 27, 28,
  29, 30,
]
