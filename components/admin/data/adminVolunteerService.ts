import {
  createAdminVolunteer,
  type CreateAdminVolunteerBody,
} from '@/lib/api/adminUsers'
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

export async function createVolunteerFromForm(
  data: VolunteerFormData,
): Promise<CreateVolunteerResult> {
  const body = mapVolunteerFormToCreateBody(data)
  const user = await createAdminVolunteer(body)
  return { user, temporaryPassword: body.password }
}
