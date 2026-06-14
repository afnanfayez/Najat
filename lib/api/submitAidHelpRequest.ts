import { request } from '@/lib/api/api'
import type { AidHelpRequestForm } from '@/schemas/aidHelpRequest'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

function extractMsg(msg: unknown): string {
  if (!msg) return ''
  if (typeof msg === 'string') return msg
  if (typeof msg === 'object' && msg !== null) {
    const m = msg as Record<string, string | undefined>
    return m.ar ?? m.en ?? ''
  }
  return String(msg)
}

function extractErrors(errors: unknown): string {
  if (!Array.isArray(errors) || errors.length === 0) return ''
  return errors
    .map((e: any) => extractMsg(e?.message))
    .filter(Boolean)
    .join(' • ')
}

export async function submitAidHelpRequest(
  payload: AidHelpRequestForm,
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  // Map frontend field names → API field names (CreateAidRequestDto)
  const apiBody = {
    husbandName: payload.husbandName,
    husbandIdNumber: payload.husbandNationalId,
    wifeName: payload.wifeName,
    wifeIdNumber: payload.wifeNationalId,
    femaleChildrenCount: payload.daughtersCount,
    maleChildrenCount: payload.sonsCount,
    phoneNumber: payload.phone,
    currentLocation: payload.currentLocation,
    aidOrganizationName: (payload as any).aidOrganizationName || '',
  }

  try {
    const data = await request(
      `${V1_ROOT}/aid/${encodeURIComponent(payload.aidOrganizationId)}/requests`,
      { method: 'POST', body: JSON.stringify(apiBody) },
    )
    return {
      ok: true,
      message: extractMsg(data?.message) || 'تم استلام طلبك بنجاح',
    }
  } catch (err: any) {
    const fieldErrors = extractErrors(err?.errors)
    const topMsg = err?.message || 'تعذر إرسال الطلب. تحقق من الاتصال وحاول مرة أخرى.'
    return {
      ok: false,
      message: fieldErrors || topMsg,
    }
  }
}
