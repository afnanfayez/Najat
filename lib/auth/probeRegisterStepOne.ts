import { authAPI } from '@/lib/api/api'
import { interpretStepOneRegisterProbe } from '@/lib/auth/registerApiErrors'

export type ProbeRegisterStepOneInput = {
  name: string
  email: string
  phone: string
}

export function buildStepOneProbePayload(input: ProbeRegisterStepOneInput) {
  const phone = input.phone.trim()
  return {
    email: input.email.trim() || 'test@test.com',
    fullName: input.name.trim() || 'Test User',
    phoneNumber: phone.startsWith('+') ? phone : `+970${phone.replace(/^0+/, '')}`,
    password: 'DummyPassword123!',
    role: 'resident' as const,
  }
}

/**
 * تحقق الباك إند من عدم تكرار البريد/الجوال باستخدام طلب register مع كلمة مرور وهمية.
 */
export async function probeRegisterStepOne(input: ProbeRegisterStepOneInput) {
  try {
    await authAPI.register(buildStepOneProbePayload(input))
    return { ok: true as const }
  } catch (err) {
    return interpretStepOneRegisterProbe(err)
  }
}
