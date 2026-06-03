import type {
  AdminHealthFacility,
  AdminHealthMedicalContent,
  AdminHealthStatsDto,
} from '@/schemas/adminHealth'

export const ADMIN_HEALTH_REGION_OPTIONS = [
  { value: 'all', label: 'جميع المناطق' },
  { value: 'north', label: 'شمال قطاع غزة' },
  { value: 'central', label: 'وسط قطاع غزة' },
  { value: 'south', label: 'جنوب قطاع غزة' },
] as const

export const ADMIN_HEALTH_STATUS_OPTIONS = [
  { value: 'all', label: 'الحالة' },
  { value: 'open', label: 'مفتوح الآن' },
  { value: 'closed', label: 'مغلق' },
  { value: 'maintenance', label: 'تحت الصيانة' },
] as const

export const ADMIN_HEALTH_CONTENT_STATUS_LABELS: Record<
  AdminHealthMedicalContent['status'],
  string
> = {
  published: 'منشور',
  review: 'تحت المراجعة',
  draft: 'مسودة',
}

export const ADMIN_HEALTH_STATS: AdminHealthStatsDto = {
  totalFacilities: 1284,
  activeNow: 942,
  underMaintenance: 42,
}

/** صورة موحّدة لمقالات المحتوى الطبي — مطابقة لدليل الصحة */
export const ADMIN_HEALTH_CONTENT_THUMBNAIL = '/assets/artical.png'

export const ADMIN_HEALTH_FACILITIES: AdminHealthFacility[] = [
  {
    id: '1',
    name: 'مستشفى شهداء الأقصى',
    address: 'دير البلح',
    imageUrl: '/assets/health1.jpg',
    isOpen: true,
    workloadPercent: 60,
    phone: '+970599000001',
    region: 'central',
    status: 'open',
  },
  {
    id: '2',
    name: 'مستشفى المعمداني',
    address: 'غزة - الرمال',
    imageUrl: '/assets/health2.jpg',
    isOpen: true,
    workloadPercent: 35,
    phone: '+970599000002',
    region: 'north',
    status: 'open',
  },
  {
    id: '3',
    name: 'مستشفى ناصر الطبي',
    address: 'خان يونس',
    imageUrl: '/assets/health3.jpg',
    isOpen: true,
    workloadPercent: 5,
    phone: '+970599000003',
    region: 'south',
    status: 'open',
  },
  {
    id: '4',
    name: 'مستشفى الأقصى الجامعي',
    address: 'غزة - التفاح',
    imageUrl: '/assets/health4.png',
    isOpen: false,
    workloadPercent: 0,
    phone: '+970599000004',
    region: 'north',
    status: 'maintenance',
  },
  {
    id: '5',
    name: 'مستشفى الأمل',
    address: 'رفح',
    imageUrl: '/assets/health5.jpg',
    isOpen: true,
    workloadPercent: 78,
    phone: '+970599000005',
    region: 'south',
    status: 'open',
  },
  {
    id: '6',
    name: 'مستشفى الصديق',
    address: 'بيت لاهيا',
    imageUrl: '/assets/health6.jpg',
    isOpen: true,
    workloadPercent: 22,
    phone: '+970599000006',
    region: 'north',
    status: 'open',
  },
]

export const ADMIN_HEALTH_MEDICAL_CONTENT: AdminHealthMedicalContent[] = [
  {
    id: '1',
    title: 'دليل الإسعافات الأولية الشامل 2024',
    author: 'د. أحمد السيد',
    date: '12 مايو 2024',
    thumbnailUrl: ADMIN_HEALTH_CONTENT_THUMBNAIL,
    status: 'published',
  },
  {
    id: '2',
    title: 'كيفية التعامل مع حالات الاختناق',
    author: 'د. سارة محمود',
    date: '10 مايو 2024',
    thumbnailUrl: ADMIN_HEALTH_CONTENT_THUMBNAIL,
    status: 'review',
  },
  {
    id: '3',
    title: 'الوقاية من الأمراض المعدية في الأزمات',
    author: 'د. خالد عمر',
    date: '8 مايو 2024',
    thumbnailUrl: ADMIN_HEALTH_CONTENT_THUMBNAIL,
    status: 'draft',
  },
  {
    id: '4',
    title: 'دليل التغذية السليمة للأطفال',
    author: 'د. ليلى حسن',
    date: '5 مايو 2024',
    thumbnailUrl: ADMIN_HEALTH_CONTENT_THUMBNAIL,
    status: 'published',
  },
]
