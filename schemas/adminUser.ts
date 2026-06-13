export type AdminUserStatus = 'active' | 'disabled' | 'pending_review'

export type AdminUserRole = 'resident' | 'volunteer' | 'admin'

export type AdminBackendUserDto = {
  id: string
  email: string
  fullName: string
  phoneNumber?: string | null
  gender?: 'male' | 'female' | null
  ageGroup?: '18-40' | 'above 40' | null
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | null
  healthStatus?: 'Healthy' | 'Chronically Ill' | 'Injured' | 'Amputee' | null
  nationalId?: string | null
  housingStatus?: string | null
  familyMembersCount?: number | null
  femalesCount?: number | null
  malesCount?: number | null
  region?: string | null
  role: AdminUserRole
  isVerified: boolean
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  version?: number
}

/** Normalized user shape consumed by the admin UI. */
export type AdminUserDto = {
  id: string
  name: string
  fullName: string
  email: string
  role: AdminUserRole
  region: string
  status: AdminUserStatus
  lastActivity: string
  enabled: boolean
  isActive: boolean
  isVerified: boolean
  phoneNumber?: string | null
  gender?: AdminBackendUserDto['gender']
  ageGroup?: AdminBackendUserDto['ageGroup']
  maritalStatus?: AdminBackendUserDto['maritalStatus']
  healthStatus?: AdminBackendUserDto['healthStatus']
  nationalId?: string | null
  housingStatus?: string | null
  familyMembersCount?: number | null
  femalesCount?: number | null
  malesCount?: number | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export type AdminUsersStatsDto = {
  totalUsers: number
  admins: number
  pendingApproval: number
  activeUsers?: number
  verifiedUsers?: number
  roleBreakdown?: Partial<Record<AdminUserRole, number>>
  genderBreakdown?: Record<string, number>
  healthStatusBreakdown?: Record<string, number>
  regionBreakdown?: Record<string, number>
}

export type AdminUsersListResponse = {
  users: AdminUserDto[]
  stats: AdminUsersStatsDto
  total: number
  page: number
  pageSize: number
}

export type AdminUserRoleFilter = 'all' | AdminUserRole

export type AdminUserRegionFilter = 'all' | string

export type AdminUsersQueryParams = {
  search?: string
  role?: AdminUserRoleFilter
  region?: AdminUserRegionFilter
  isActive?: boolean
  isVerified?: boolean
  withDeleted?: boolean
  page?: number
  pageSize?: number
}

/** نموذج العرض بعد التحويل في الواجهة */
export type AdminManagedUser = AdminUserDto & {
  roleLabel: string
  statusLabel: string
  statusColor: string
}
