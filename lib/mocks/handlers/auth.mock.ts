import { MockHttpError } from '@/lib/mocks/store/errorTriggers'
import { mintFakeJwt } from '@/lib/mocks/store/jwt'
import { bilingual, nowIso } from '@/lib/mocks/crud/paginationHelpers'
import { bodyToRecord } from '@/lib/mocks/formDataUtils'
import { MOCK_OTP } from '@/lib/mocks/seeds/users.seed'
import type { MockUserRecord } from '@/lib/mocks/seeds/users.seed'
import {
  findUserByEmail,
  stripPassword,
  upsertUser,
} from '@/lib/mocks/handlers/usersStore'

type RequestBody = FormData | Record<string, unknown> | string | null | undefined

function authEnvelope(user: MockUserRecord, statusCode = 200) {
  const token = mintFakeJwt({ sub: user.id, role: user.role, email: user.email })
  return {
    success: true as const,
    statusCode,
    message: bilingual('تم بنجاح', 'Success'),
    data: {
      token,
      user: stripPassword(user),
    },
    timestamp: nowIso(),
  }
}

export async function handleLogin(body: RequestBody) {
  const record = await bodyToRecord(body)
  const email = String(record.email ?? '')
  const password = String(record.password ?? '')
  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    throw new MockHttpError(401, 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
  }
  if (!user.isActive) {
    throw new MockHttpError(403, 'تم تعطيل هذا الحساب')
  }
  return authEnvelope(user)
}

export async function handleRegister(body: RequestBody) {
  const record = await bodyToRecord(body)
  const email = String(record.email ?? '').trim().toLowerCase()
  if (!email) throw new MockHttpError(400, 'invalid email')
  if (findUserByEmail(email)) {
    throw new MockHttpError(409, 'email already exists')
  }

  const now = nowIso()
  const newUser: MockUserRecord = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email,
    password: String(record.password ?? ''),
    fullName: String(record.fullName ?? email.split('@')[0]),
    role: (record.role as MockUserRecord['role']) ?? 'resident',
    isVerified: false,
    isActive: true,
    phoneNumber: (record.phoneNumber as string) ?? null,
    gender: (record.gender as MockUserRecord['gender']) ?? null,
    ageGroup: (record.ageGroup as MockUserRecord['ageGroup']) ?? null,
    maritalStatus: (record.maritalStatus as MockUserRecord['maritalStatus']) ?? null,
    healthStatus: (record.healthStatus as MockUserRecord['healthStatus']) ?? null,
    nationalId: (record.nationalId as string) ?? null,
    housingStatus: (record.housingStatus as string) ?? null,
    familyMembersCount: (record.familyMembersCount as number) ?? null,
    femalesCount: (record.femalesCount as number) ?? null,
    malesCount: (record.malesCount as number) ?? null,
    region: (record.region as string) ?? null,
    createdAt: now,
    updatedAt: now,
  }
  upsertUser(newUser)
  return authEnvelope(newUser, 201)
}

export async function handleVerify(body: RequestBody) {
  const record = await bodyToRecord(body)
  const email = String(record.email ?? '')
  const code = String(record.code ?? '')
  const user = findUserByEmail(email)
  if (!user) throw new MockHttpError(404, 'الحساب غير موجود')
  if (code !== MOCK_OTP) {
    throw new MockHttpError(400, 'رمز التحقق غير صحيح')
  }
  const updated: MockUserRecord = { ...user, isVerified: true, updatedAt: nowIso() }
  upsertUser(updated)
  return authEnvelope(updated)
}

export async function handleForgotPassword(body: RequestBody) {
  const record = await bodyToRecord(body)
  const email = String(record.email ?? '')
  // Always "succeeds" in mock mode — simulates a code being emailed out.
  void email
  return {
    success: true as const,
    statusCode: 200,
    message: bilingual(
      `تم إرسال رمز التحقق (استخدم ${MOCK_OTP} في وضع المحاكاة)`,
      `Verification code sent (use ${MOCK_OTP} in mock mode)`,
    ),
    timestamp: nowIso(),
  }
}

export async function handleResetPassword(body: RequestBody) {
  const record = await bodyToRecord(body)
  const email = String(record.email ?? '')
  const code = String(record.code ?? '')
  const newPassword = String(record.newPassword ?? '')
  const user = findUserByEmail(email)
  if (!user) throw new MockHttpError(404, 'الحساب غير موجود')
  if (code !== MOCK_OTP) {
    throw new MockHttpError(400, 'رمز التحقق غير صحيح')
  }
  upsertUser({ ...user, password: newPassword, updatedAt: nowIso() })
  return {
    success: true as const,
    statusCode: 200,
    message: bilingual('تم تغيير كلمة المرور بنجاح', 'Password changed successfully'),
    timestamp: nowIso(),
  }
}
