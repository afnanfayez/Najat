import type {
  AdminUserDto,
  AdminUserRole,
  AdminUsersStatsDto,
} from '@/schemas/adminUser'
import { USE_MOCK_ADMIN_USERS } from '@/lib/mocks/mockConfig'

export { USE_MOCK_ADMIN_USERS }

export const ADMIN_USER_ROLE_OPTIONS: { value: AdminUserRole; label: string }[] = [
  { value: 'admin', label: 'مسؤول' },
  { value: 'volunteer', label: 'متطوع' },
  { value: 'resident', label: 'مستفيد' },
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

// Mutable in-memory store — mimics a real database for mock mode
const _mockUsers: AdminUserDto[] = [
  {
    id: '1',
    name: 'أحمد الشريف',
    fullName: 'أحمد الشريف',
    email: 'ahmed.alsharif@najaa.sa',
    role: 'admin',
    region: 'شمال القطاع',
    status: 'active',
    lastActivity: 'منذ 10 دقائق',
    enabled: true,
    isActive: true,
    isVerified: true,
  },
  {
    id: '2',
    name: 'سارة محمود',
    fullName: 'سارة محمود',
    email: 'sara.mahmoud@najaa.sa',
    role: 'resident',
    region: 'الوسطى',
    status: 'active',
    lastActivity: 'منذ 3 أيام',
    enabled: true,
    isActive: true,
    isVerified: true,
  },
  {
    id: '3',
    name: 'خالد عمر',
    fullName: 'خالد عمر',
    email: 'khaled.omar@najaa.sa',
    role: 'volunteer',
    region: 'رفح',
    status: 'disabled',
    lastActivity: 'منذ أسبوع',
    enabled: false,
    isActive: false,
    isVerified: true,
  },
  {
    id: '4',
    name: 'نور الدين',
    fullName: 'نور الدين',
    email: 'nour.aldeen@najaa.sa',
    role: 'resident',
    region: 'خانيونس',
    status: 'pending_review',
    lastActivity: 'نشط الآن',
    enabled: true,
    isActive: true,
    isVerified: false,
  },
  {
    id: '5',
    name: 'ليلى حسن',
    fullName: 'ليلى حسن',
    email: 'layla.hassan@najaa.sa',
    role: 'volunteer',
    region: 'غزة',
    status: 'active',
    lastActivity: 'منذ ساعة',
    enabled: true,
    isActive: true,
    isVerified: true,
  },
  {
    id: '6',
    name: 'يوسف كمال',
    fullName: 'يوسف كمال',
    email: 'youssef.kamal@najaa.sa',
    role: 'volunteer',
    region: 'دير البلح',
    status: 'pending_review',
    lastActivity: 'منذ 5 دقائق',
    enabled: true,
    isActive: true,
    isVerified: false,
  },
  {
    id: '7',
    name: 'مريم العطار',
    fullName: 'مريم العطار',
    email: 'mariam.attar@najaa.sa',
    role: 'resident',
    region: 'شمال القطاع',
    status: 'active',
    lastActivity: 'منذ يومين',
    enabled: true,
    isActive: true,
    isVerified: true,
  },
  {
    id: '8',
    name: 'عمر سالم',
    fullName: 'عمر سالم',
    email: 'omar.salem@najaa.sa',
    role: 'volunteer',
    region: 'الوسطى',
    status: 'disabled',
    lastActivity: 'منذ 4 أيام',
    enabled: false,
    isActive: false,
    isVerified: true,
  },
  {
    id: '9',
    name: 'فاطمة ناصر',
    fullName: 'فاطمة ناصر',
    email: 'fatima.nasser@najaa.sa',
    role: 'admin',
    region: 'رفح',
    status: 'active',
    lastActivity: 'منذ 20 دقيقة',
    enabled: true,
    isActive: true,
    isVerified: true,
  },
  {
    id: '10',
    name: 'محمد رضوان',
    fullName: 'محمد رضوان',
    email: 'mohammed.ridwan@najaa.sa',
    role: 'volunteer',
    region: 'خانيونس',
    status: 'pending_review',
    lastActivity: 'منذ ساعتين',
    enabled: false,
    isActive: false,
    isVerified: false,
  },
  {
    id: '11',
    name: 'هناء أبو سعد',
    fullName: 'هناء أبو سعد',
    email: 'hanaa.abusaad@najaa.sa',
    role: 'resident',
    region: 'غزة',
    status: 'active',
    lastActivity: 'نشط الآن',
    enabled: true,
    isActive: true,
    isVerified: true,
  },
  {
    id: '12',
    name: 'إبراهيم فارس',
    fullName: 'إبراهيم فارس',
    email: 'ibrahim.fares@najaa.sa',
    role: 'resident',
    region: 'دير البلح',
    status: 'active',
    lastActivity: 'منذ 6 ساعات',
    enabled: true,
    isActive: true,
    isVerified: true,
  },
]

export function getMockAdminUsersList(): AdminUserDto[] {
  return _mockUsers
}

export function updateMockAdminUser(
  id: string,
  updates: Partial<AdminUserDto>,
): AdminUserDto | null {
  const idx = _mockUsers.findIndex((u) => u.id === id)
  if (idx === -1) return null
  const current = _mockUsers[idx]
  const name = updates.fullName ?? updates.name ?? current.name
  const isActive = updates.isActive ?? updates.enabled ?? current.isActive
  const isVerified =
    updates.status === 'active'
      ? true
      : updates.status === 'pending_review'
        ? false
        : updates.isVerified ?? current.isVerified
  const status =
    updates.status ??
    (!isActive ? 'disabled' : !isVerified ? 'pending_review' : 'active')

  _mockUsers[idx] = {
    ...current,
    ...updates,
    id: current.id,
    name,
    fullName: name,
    enabled: isActive,
    isActive,
    isVerified,
    status,
  }
  return _mockUsers[idx]
}
