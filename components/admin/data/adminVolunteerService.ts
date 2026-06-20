import {
  createAdminVolunteer,
  createAdminResident,
  type CreateAdminVolunteerBody,
  type CreateAdminResidentBody,
} from '@/lib/api/adminUsers'
import { enqueueOfflineOp, putAdminUsers } from '@/lib/offline/db'
import type { AdminUserDto } from '@/schemas/adminUser'
import type { VolunteerFormData } from '@/components/admin/users/add-volunteer/types'

export type CreateVolunteerResult = {
  user: AdminUserDto | null
  temporaryPassword: string
}

const NATIONAL_ID_PATTERN = /^\d{9}$/

type BackendValidationError = {
  field?: unknown
  message?: unknown
}

type ApiErrorLike = {
  message?: unknown
  errors?: unknown
  fullData?: {
    errors?: unknown
  }
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

function extractMessage(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.ar === 'string') return obj.ar
    if (typeof obj.en === 'string') return obj.en
  }
  return null
}

function inferAgeGroup(birthDate: string): CreateAdminVolunteerBody['ageGroup'] {
  const timestamp = new Date(birthDate).getTime()
  if (Number.isNaN(timestamp)) return undefined

  const ageMs = Date.now() - timestamp
  const ageDate = new Date(ageMs)
  const age = Math.abs(ageDate.getUTCFullYear() - 1970)

  return age > 40 ? 'above 40' : '18-40'
}

function buildTemporaryPassword(data: VolunteerFormData): string {
  const idDigits = digitsOnly(data.idNumber)
  const phoneDigits = digitsOnly(data.primaryPhone)
  const suffix = (idDigits || phoneDigits || '123456').slice(-6).padStart(6, '0')
  return `Najat@${suffix}`
}

export function validateVolunteerFormForApi(data: VolunteerFormData): string | null {
  const nationalId = data.idNumber.trim()
  if (!NATIONAL_ID_PATTERN.test(nationalId)) {
    return 'رقم الهوية يجب أن يتكون من 9 أرقام'
  }
  return null
}

export function getVolunteerCreateErrorMessage(error: unknown): string {
  const err = error as ApiErrorLike
  const errors =
    Array.isArray(err?.errors)
      ? err.errors
      : Array.isArray(err?.fullData?.errors)
        ? err.fullData.errors
        : []

  const nationalIdError = errors.find((item: unknown) => {
    if (!item || typeof item !== 'object') return false
    return (item as BackendValidationError).field === 'nationalId'
  }) as BackendValidationError | undefined

  if (nationalIdError) {
    return 'رقم الهوية يجب أن يتكون من 9 أرقام'
  }

  const firstError = errors.find(
    (item: unknown) => item && typeof item === 'object',
  ) as BackendValidationError | undefined
  const firstMessage = extractMessage(firstError?.message)
  if (firstMessage && firstMessage !== 'validation.IS_LENGTH') {
    return firstMessage
  }

  return extractMessage(err?.message) ?? 'تعذّر إرسال الطلب'
}

export function mapVolunteerFormToCreateBody(
  data: VolunteerFormData,
): CreateAdminVolunteerBody {
  const region = [data.currentAddress, data.detailedAddress]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' - ')

  return {
    email: data.email.trim(),
    password: buildTemporaryPassword(data),
    fullName: data.fullName.trim(),
    phoneNumber: data.primaryPhone.trim() || undefined,
    ageGroup: inferAgeGroup(data.birthDate),
    healthStatus: 'Healthy',
    nationalId: data.idNumber.trim(),
    region: region || undefined,
  }
}

function buildOptimisticAdminUser(
  tempId: string,
  role: 'volunteer' | 'resident',
  body: CreateAdminVolunteerBody | CreateAdminResidentBody,
): AdminUserDto {
  return {
    id: tempId,
    name: body.fullName,
    fullName: body.fullName,
    email: body.email,
    role,
    region: body.region ?? 'غير محدد',
    status: 'pending_review',
    lastActivity: 'الآن',
    enabled: true,
    isActive: true,
    isVerified: false,
    phoneNumber: body.phoneNumber,
    gender: body.gender,
    ageGroup: body.ageGroup,
    healthStatus: body.healthStatus,
    nationalId: body.nationalId,
    housingStatus: body.housingStatus,
  }
}

export async function createVolunteerFromForm(
  data: VolunteerFormData,
): Promise<CreateVolunteerResult> {
  const body = mapVolunteerFormToCreateBody(data)

  // Offline: optimistically cache with a temp ID, queue for later sync
  if (typeof window !== 'undefined' && !navigator.onLine) {
    const tempId = `offline-${Date.now()}`
    const optimistic = buildOptimisticAdminUser(tempId, 'volunteer', body)
    await putAdminUsers([optimistic])
    await enqueueOfflineOp({ type: 'CREATE_VOLUNTEER', payload: { body, tempId } })
    return { user: optimistic, temporaryPassword: body.password }
  }

  const user = await createAdminVolunteer(body)
  return { user, temporaryPassword: body.password }
}

export function mapResidentFormToCreateBody(
  data: VolunteerFormData,
): CreateAdminResidentBody {
  const region = [data.currentAddress, data.detailedAddress]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' - ')

  return {
    email: data.email.trim(),
    password: buildTemporaryPassword(data),
    fullName: data.fullName.trim(),
    phoneNumber: data.primaryPhone.trim() || undefined,
    ageGroup: inferAgeGroup(data.birthDate),
    nationalId: data.idNumber.trim() || undefined,
    region: region || undefined,
    gender: data.gender ?? undefined,
    maritalStatus: data.maritalStatus ?? undefined,
    housingStatus: data.housingStatus?.trim() || undefined,
    familyMembersCount: data.familyMembersCount ? Number(data.familyMembersCount) : undefined,
    femalesCount: data.femalesCount ? Number(data.femalesCount) : undefined,
    malesCount: data.malesCount ? Number(data.malesCount) : undefined,
    healthStatus: 'Healthy',
  }
}

export async function createResidentFromForm(
  data: VolunteerFormData,
): Promise<CreateVolunteerResult> {
  const body = mapResidentFormToCreateBody(data)

  // Offline: optimistically cache with a temp ID, queue for later sync
  if (typeof window !== 'undefined' && !navigator.onLine) {
    const tempId = `offline-${Date.now()}`
    const optimistic = buildOptimisticAdminUser(tempId, 'resident', body)
    await putAdminUsers([optimistic])
    await enqueueOfflineOp({ type: 'CREATE_RESIDENT', payload: { body, tempId } })
    return { user: optimistic, temporaryPassword: body.password }
  }

  const user = await createAdminResident(body)
  return { user, temporaryPassword: body.password }
}
