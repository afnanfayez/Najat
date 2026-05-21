import type {
  AdminUserDto,
  AdminUserRole,
  AdminUsersStatsDto,
} from '@/schemas/adminUser'
import { USE_MOCK_ADMIN_USERS } from '@/lib/mocks/mockConfig'

export { USE_MOCK_ADMIN_USERS }

export const ADMIN_USER_ROLE_OPTIONS: { value: AdminUserRole; label: string }[] = [
  { value: 'admin', label: 'مسؤول' },
  { value: 'coordinator', label: 'منسق' },
  { value: 'volunteer', label: 'متطوع' },
  { value: 'reviewer', label: 'مراجع' },
]

export const ADMIN_USER_REGION_OPTIONS = [
  'شمال القطاع',
  'الوسطى',
  'رفح',
  'خانيونس',
  'دير البلح',
  'غزة',
] as const

export const ADMIN_USERS_STATS_MOCK: AdminUsersStatsDto = {
  totalUsers: 14280,
  admins: 12,
  pendingApproval: 8,
}

export const ADMIN_USERS_MOCK: AdminUserDto[] = [
  {
    id: '1',
    name: 'أحمد الشريف',
    email: 'ahmed.alsharif@najaa.sa',
    role: 'admin',
    region: 'شمال القطاع',
    status: 'active',
    lastActivity: 'منذ 10 دقائق',
    enabled: true,
  },
  {
    id: '2',
    name: 'سارة محمود',
    email: 'sara.mahmoud@najaa.sa',
    role: 'coordinator',
    region: 'الوسطى',
    status: 'active',
    lastActivity: 'منذ 3 أيام',
    enabled: true,
  },
  {
    id: '3',
    name: 'خالد عمر',
    email: 'khaled.omar@najaa.sa',
    role: 'volunteer',
    region: 'رفح',
    status: 'disabled',
    lastActivity: 'منذ أسبوع',
    enabled: false,
  },
  {
    id: '4',
    name: 'نور الدين',
    email: 'nour.aldeen@najaa.sa',
    role: 'reviewer',
    region: 'خانيونس',
    status: 'pending_review',
    lastActivity: 'نشط الآن',
    enabled: true,
  },
  {
    id: '5',
    name: 'ليلى حسن',
    email: 'layla.hassan@najaa.sa',
    role: 'volunteer',
    region: 'غزة',
    status: 'active',
    lastActivity: 'منذ ساعة',
    enabled: true,
  },
  {
    id: '6',
    name: 'يوسف كمال',
    email: 'youssef.kamal@najaa.sa',
    role: 'coordinator',
    region: 'دير البلح',
    status: 'pending_review',
    lastActivity: 'منذ 5 دقائق',
    enabled: true,
  },
  {
    id: '7',
    name: 'مريم العطار',
    email: 'mariam.attar@najaa.sa',
    role: 'reviewer',
    region: 'شمال القطاع',
    status: 'active',
    lastActivity: 'منذ يومين',
    enabled: true,
  },
  {
    id: '8',
    name: 'عمر سالم',
    email: 'omar.salem@najaa.sa',
    role: 'volunteer',
    region: 'الوسطى',
    status: 'disabled',
    lastActivity: 'منذ 4 أيام',
    enabled: false,
  },
  {
    id: '9',
    name: 'فاطمة ناصر',
    email: 'fatima.nasser@najaa.sa',
    role: 'admin',
    region: 'رفح',
    status: 'active',
    lastActivity: 'منذ 20 دقيقة',
    enabled: true,
  },
  {
    id: '10',
    name: 'محمد رضوان',
    email: 'mohammed.ridwan@najaa.sa',
    role: 'volunteer',
    region: 'خانيونس',
    status: 'pending_review',
    lastActivity: 'منذ ساعتين',
    enabled: false,
  },
  {
    id: '11',
    name: 'هناء أبو سعد',
    email: 'hanaa.abusaad@najaa.sa',
    role: 'coordinator',
    region: 'غزة',
    status: 'active',
    lastActivity: 'نشط الآن',
    enabled: true,
  },
  {
    id: '12',
    name: 'إبراهيم فارس',
    email: 'ibrahim.fares@najaa.sa',
    role: 'reviewer',
    region: 'دير البلح',
    status: 'active',
    lastActivity: 'منذ 6 ساعات',
    enabled: true,
  },
]

export const ADMIN_USERS_TOTAL_MOCK = 1284

export function getMockAdminUsersList(): AdminUserDto[] {
  return ADMIN_USERS_MOCK
}
