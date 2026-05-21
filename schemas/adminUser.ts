export type AdminUserStatus = 'active' | 'disabled' | 'pending_review'

export type AdminUserRole = 'admin' | 'coordinator' | 'volunteer' | 'reviewer'

/** شكل البيانات القادمة من الباك اند */
export type AdminUserDto = {
  id: string
  name: string
  email: string
  role: AdminUserRole
  region: string
  status: AdminUserStatus
  lastActivity: string
  enabled: boolean
}

export type AdminUsersStatsDto = {
  totalUsers: number
  admins: number
  pendingApproval: number
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
  page?: number
  pageSize?: number
}

/** نموذج العرض بعد التحويل في الواجهة */
export type AdminManagedUser = AdminUserDto & {
  roleLabel: string
  statusLabel: string
  statusColor: string
}
