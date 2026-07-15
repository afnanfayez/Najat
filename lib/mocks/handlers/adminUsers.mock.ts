import { bodyToRecord, type MockRequestBody } from '@/lib/mocks/formDataUtils'
import { nowIso } from '@/lib/mocks/crud/paginationHelpers'
import { MockHttpError, checkErrorTrigger } from '@/lib/mocks/store/errorTriggers'
import {
  usersStore,
  findUserById,
  upsertUser,
  stripPassword,
} from '@/lib/mocks/handlers/usersStore'
import type { MockUserRecord } from '@/lib/mocks/seeds/users.seed'

function paginate(users: MockUserRecord[], page: number, limit: number) {
  const totalItems = users.length
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, limit)))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * limit
  const pageItems = users.slice(start, start + limit)
  return {
    pageItems,
    meta: {
      totalItems,
      itemCount: pageItems.length,
      itemsPerPage: limit,
      totalPages,
      currentPage,
      syncTimestamp: nowIso(),
    },
  }
}

/** /admin/users and /users?since=... both return this double-nested shape. */
function listEnvelope(users: MockUserRecord[], meta: Record<string, unknown>) {
  return {
    success: true as const,
    statusCode: 200,
    data: { data: users.map(stripPassword), meta },
    timestamp: nowIso(),
  }
}

function singleEnvelope(user: MockUserRecord) {
  return {
    success: true as const,
    statusCode: 200,
    data: stripPassword(user),
    timestamp: nowIso(),
  }
}

export function getStats() {
  const users = usersStore.getAll().filter((u) => !u.deletedAt)
  const roleBreakdown = {
    admin: users.filter((u) => u.role === 'admin').length,
    volunteer: users.filter((u) => u.role === 'volunteer').length,
    resident: users.filter((u) => u.role === 'resident').length,
  }
  return {
    success: true as const,
    statusCode: 200,
    data: {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      verifiedUsers: users.filter((u) => u.isVerified).length,
      roleBreakdown,
      genderBreakdown: {
        male: users.filter((u) => u.gender === 'male').length,
        female: users.filter((u) => u.gender === 'female').length,
      },
      healthStatusBreakdown: {},
      regionBreakdown: {},
    },
    timestamp: nowIso(),
  }
}

export function listUsers(query: URLSearchParams) {
  checkErrorTrigger(query.get('search'))
  const page = Number(query.get('page') ?? '1') || 1
  const limit = Number(query.get('limit') ?? '10') || 10
  const search = query.get('search')?.toLowerCase()
  const role = query.get('role')
  const isActiveParam = query.get('isActive')
  const isVerifiedParam = query.get('isVerified')

  let users = usersStore.getAll().filter((u) => !u.deletedAt)
  if (role) users = users.filter((u) => u.role === role)
  if (isActiveParam != null) users = users.filter((u) => String(u.isActive) === isActiveParam)
  if (isVerifiedParam != null) users = users.filter((u) => String(u.isVerified) === isVerifiedParam)
  if (search) {
    users = users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.phoneNumber ?? '').toLowerCase().includes(search),
    )
  }

  const { pageItems, meta } = paginate(users, page, limit)
  return listEnvelope(pageItems, meta)
}

export function listUsersWithDeleted(query: URLSearchParams) {
  const page = Number(query.get('page') ?? '1') || 1
  const limit = Number(query.get('limit') ?? '10') || 10
  const users = usersStore.getAll()
  const { pageItems, meta } = paginate(users, page, limit)
  return listEnvelope(pageItems, meta)
}

export function getUserById(id: string) {
  checkErrorTrigger(id)
  const user = findUserById(id)
  if (!user) throw new MockHttpError(404, 'المستخدم غير موجود')
  return singleEnvelope(user)
}

export async function updateUser(id: string, body: MockRequestBody) {
  checkErrorTrigger(id)
  const record = await bodyToRecord(body)
  const user = findUserById(id)
  if (!user) throw new MockHttpError(404, 'المستخدم غير موجود')
  const updated: MockUserRecord = {
    ...user,
    fullName: (record.fullName as string) ?? user.fullName,
    email: (record.email as string) ?? user.email,
    role: (record.role as MockUserRecord['role']) ?? user.role,
    region: (record.region as string) ?? user.region,
    phoneNumber: (record.phoneNumber as string) ?? user.phoneNumber,
    isActive: typeof record.isActive === 'boolean' ? record.isActive : user.isActive,
    isVerified: typeof record.isVerified === 'boolean' ? record.isVerified : user.isVerified,
    updatedAt: nowIso(),
  }
  upsertUser(updated)
  return singleEnvelope(updated)
}

export async function setActive(id: string, body: MockRequestBody) {
  checkErrorTrigger(id)
  const record = await bodyToRecord(body)
  const user = findUserById(id)
  if (!user) throw new MockHttpError(404, 'المستخدم غير موجود')
  const updated = { ...user, isActive: Boolean(record.isActive), updatedAt: nowIso() }
  upsertUser(updated)
  return singleEnvelope(updated)
}

export async function setVerified(id: string, body: MockRequestBody) {
  checkErrorTrigger(id)
  const record = await bodyToRecord(body)
  const user = findUserById(id)
  if (!user) throw new MockHttpError(404, 'المستخدم غير موجود')
  const updated = { ...user, isVerified: Boolean(record.isVerified), updatedAt: nowIso() }
  upsertUser(updated)
  return singleEnvelope(updated)
}

export function restoreUser(id: string) {
  checkErrorTrigger(id)
  const user = findUserById(id)
  if (!user) throw new MockHttpError(404, 'المستخدم غير موجود')
  const updated = { ...user, deletedAt: null, updatedAt: nowIso() }
  upsertUser(updated)
  return singleEnvelope(updated)
}

export function deleteUser(id: string) {
  checkErrorTrigger(id)
  const user = findUserById(id)
  if (!user) throw new MockHttpError(404, 'المستخدم غير موجود')
  upsertUser({ ...user, deletedAt: nowIso() })
  return { success: true as const, statusCode: 200, timestamp: nowIso() }
}

async function createUser(body: MockRequestBody, role: MockUserRecord['role']) {
  const record = await bodyToRecord(body)
  const now = nowIso()
  const newUser: MockUserRecord = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: String(record.email ?? ''),
    password: String(record.password ?? ''),
    fullName: String(record.fullName ?? ''),
    role,
    isVerified: true,
    isActive: true,
    phoneNumber: (record.phoneNumber as string) ?? null,
    gender: (record.gender as MockUserRecord['gender']) ?? null,
    ageGroup: (record.ageGroup as MockUserRecord['ageGroup']) ?? null,
    healthStatus: (record.healthStatus as MockUserRecord['healthStatus']) ?? null,
    nationalId: (record.nationalId as string) ?? null,
    housingStatus: (record.housingStatus as string) ?? null,
    region: (record.region as string) ?? null,
    createdAt: now,
    updatedAt: now,
  }
  upsertUser(newUser)
  return singleEnvelope(newUser)
}

export function createVolunteer(body: MockRequestBody) {
  return createUser(body, 'volunteer')
}

export function createResident(body: MockRequestBody) {
  return createUser(body, 'resident')
}
