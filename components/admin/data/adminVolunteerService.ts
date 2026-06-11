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

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
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
    nationalId: data.idNumber.trim() || undefined,
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
