/**
 * استخراج رسائل أخطاء التسجيل من استجابات الباك إند + تفسير نتيجة طلب التحقق (probe) للخطوة 1.
 * بدون toast — للاستخدام من المكوّنات أو اختبارات الوحدة.
 */

export type StepOneProbeResult =
  | { ok: true }
  | {
      ok: false
      message: string
      clearEmail: boolean
      clearPhone: boolean
      nameError?: string
    }

export function collectErrorStrings(val: unknown, depth = 0): string[] {
  if (depth > 12) return []
  if (val == null) return []
  if (typeof val === 'string') {
    const t = val.trim()
    return t ? [t] : []
  }
  if (typeof val === 'number' || typeof val === 'boolean') return [String(val)]
  if (Array.isArray(val)) {
    return val.flatMap((x) => collectErrorStrings(x, depth + 1))
  }
  if (typeof val === 'object') {
    const o = val as Record<string, unknown>
    const preferred = ['message', 'messages', 'error', 'errors', 'detail', 'description', 'title', 'msg']
    const fromPreferred: string[] = []
    for (const k of preferred) {
      if (k in o) {
        fromPreferred.push(...collectErrorStrings(o[k], depth + 1))
      }
    }
    if (fromPreferred.length) return fromPreferred
    const entries = Object.entries(o)
    const allFlatPrimitives = entries.every(
      ([, v]) =>
        v == null ||
        typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean'
    )
    if (entries.length > 0 && allFlatPrimitives) {
      return entries.flatMap(([k, v]) => {
        if (v == null) return []
        return [`${k}: ${String(v)}`]
      })
    }
    return Object.values(o).flatMap((v) => collectErrorStrings(v, depth + 1))
  }
  return []
}

export function flattenRegisterApiMessages(err: any): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const push = (s: string) => {
    const t = s.trim()
    if (!t) return
    const key = t.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push(t)
  }
  const pushAll = (vals: string[]) => vals.forEach((v) => push(v))
  pushAll(collectErrorStrings(err?.message))
  pushAll(collectErrorStrings(err?.error))
  pushAll(collectErrorStrings(err?.fullData?.detail ?? err?.detail))
  if (err?.fullData) {
    pushAll(collectErrorStrings(err.fullData))
  }
  const pushKeyed = (fieldKey: string, val: unknown) => {
    const k = fieldKey.toLowerCase()
    let prefix = ''
    if (k.includes('email') || k === 'email') prefix = 'email: '
    else if (k.includes('phone') || k.includes('mobile') || k.includes('phonenumber'))
      prefix = 'phone: '
    const parts = collectErrorStrings(val)
    if (parts.length) {
      parts.forEach((p) => push(prefix + p))
    } else if (val != null) {
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        push(prefix + String(val))
      } else {
        try {
          push(prefix + JSON.stringify(val))
        } catch {
          push(prefix + String(val))
        }
      }
    }
  }
  const errors = err?.errors
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    for (const [key, v] of Object.entries(errors)) {
      pushKeyed(key, v)
    }
  }
  const full = err?.fullData
  if (full && typeof full === 'object') {
    const fe = full.errors
    if (fe && typeof fe === 'object' && !Array.isArray(fe)) {
      for (const [key, v] of Object.entries(fe)) {
        pushKeyed(key, v)
      }
    }
  }
  return out
}

function isEmailRelated(m: string) {
  return (
    m.includes('email') ||
    m.includes('e-mail') ||
    m.includes('بريد') ||
    (m.includes('@') && (m.includes('invalid') || m.includes('format') || m.includes('valid')))
  )
}

function isPhoneRelated(m: string) {
  return (
    m.includes('phone') ||
    m.includes('mobile') ||
    m.includes('جوال') ||
    m.includes('هاتف') ||
    m.includes('phonenumber') ||
    m.includes('phone_number')
  )
}

export function isLikelyDuplicateOrUniqueConflict(m: string) {
  return (
    m.includes('already') ||
    m.includes('exists') ||
    m.includes('exist') ||
    m.includes('unique') ||
    m.includes('taken') ||
    m.includes('registered') ||
    m.includes('duplicate') ||
    m.includes('in use') ||
    m.includes('in-use') ||
    m.includes('conflict') ||
    m.includes('used') ||
    m.includes('مستخدم') ||
    m.includes('مسجل') ||
    m.includes('مكرر')
  )
}

export function isIgnorableProbeNoiseMessage(msg: string): boolean {
  const m = msg.toLowerCase().trim()
  if (!m) return true
  if (/^\d{3}$/.test(m)) return true
  if (/^statuscode:\s*\d+$/i.test(m)) return true
  if (/^status:\s*\d+$/i.test(m)) return true
  const noise = [
    'bad request',
    'unauthorized',
    'forbidden',
    'something went wrong',
    'an error occurred',
    'validation error',
    'validation failed',
    'http exception',
    'internal server error',
    'error',
  ]
  if (noise.includes(m)) return true
  return false
}

export function step1ProbeOnlyPasswordErrors(messages: string[]): boolean {
  const meaningful = messages.filter((msg) => !isIgnorableProbeNoiseMessage(msg))
  return (
    meaningful.length > 0 &&
    meaningful.every((msg) => msg.toLowerCase().includes('password'))
  )
}

/** رموز شائعة من الباك إند مثل { "error": "EMAIL_ALREADY_EXISTS" } */
export function mapKnownRegisterErrorCode(raw: unknown): {
  clearEmail: boolean
  clearPhone: boolean
  message: string
} | null {
  if (raw == null) return null
  const c = String(raw).trim().toUpperCase().replace(/\s+/g, '_')
  if (!c) return null

  if (
    c === 'EMAIL_ALREADY_EXISTS' ||
    c === 'DUPLICATE_EMAIL' ||
    c === 'EMAIL_TAKEN' ||
    (c.includes('EMAIL') &&
      (c.includes('EXIST') || c.includes('DUPLICATE') || c.includes('TAKEN') || c.includes('ALREADY')))
  ) {
    return {
      clearEmail: true,
      clearPhone: false,
      message: 'البريد الإلكتروني مستخدم بالفعل',
    }
  }
  if (
    c === 'PHONE_ALREADY_EXISTS' ||
    c === 'PHONE_NUMBER_ALREADY_EXISTS' ||
    c === 'DUPLICATE_PHONE' ||
    c === 'PHONE_TAKEN' ||
    (c.includes('PHONE') &&
      (c.includes('EXIST') || c.includes('DUPLICATE') || c.includes('TAKEN') || c.includes('ALREADY')))
  ) {
    return {
      clearEmail: false,
      clearPhone: true,
      message: 'رقم الجوال مستخدم بالفعل',
    }
  }
  if (
    c === 'USER_ALREADY_EXISTS' ||
    c === 'ACCOUNT_ALREADY_EXISTS' ||
    c === 'CONFLICT' ||
    (c.includes('USER') && c.includes('EXIST'))
  ) {
    return {
      clearEmail: true,
      clearPhone: true,
      message: 'البريد الإلكتروني أو رقم الجوال مسجّل مسبقاً',
    }
  }
  return null
}

function extractPrimaryErrorCode(err: any): unknown {
  const fd = err?.fullData
  if (fd && typeof fd === 'object') {
    if ('error' in fd && fd.error != null) return fd.error
    if ('code' in fd && fd.code != null) return fd.code
  }
  if (err?.error != null && typeof err.error === 'string') return err.error
  return null
}

/**
 * يفسّر خطأ register(probe) للخطوة 1: نجاح تحقق الحقول (مع فشل كلمة المرور الوهمية فقط) أو فشل مع رسالة ومسح حقول.
 */
export function interpretStepOneRegisterProbe(err: unknown): StepOneProbeResult {
  const e = err as any
  const httpStatus = e?.status ?? 0

  const codeMapped = mapKnownRegisterErrorCode(extractPrimaryErrorCode(e))
  if (codeMapped) {
    return {
      ok: false,
      message: codeMapped.message,
      clearEmail: codeMapped.clearEmail,
      clearPhone: codeMapped.clearPhone,
    }
  }

  const messages = flattenRegisterApiMessages(e)
  let step1DuplicateEmail = false
  let step1DuplicatePhone = false
  let step1EmailToast: string | null = null
  let step1PhoneToast: string | null = null
  let nameError: string | undefined

  for (const msg of messages) {
    const m = msg.toLowerCase()
    let arabicMsg = msg

    if (m.includes('password') && !isEmailRelated(m) && !isPhoneRelated(m)) {
      continue
    }

    if (isEmailRelated(m)) {
      if (isLikelyDuplicateOrUniqueConflict(m)) {
        step1DuplicateEmail = true
      } else {
        if (
          m.includes('invalid') ||
          m.includes('format') ||
          m.includes('صالح') ||
          m.includes('not valid') ||
          m.includes('must be valid') ||
          m.includes('valid email')
        )
          step1EmailToast = 'البريد الإلكتروني غير صالح'
        else if (m.includes('required')) step1EmailToast = 'البريد الإلكتروني مطلوب'
        else
          step1EmailToast =
            'تعذر التحقق من البريد الإلكتروني. يرجى التعديل والمحاولة مرة أخرى'
      }
      continue
    }
    if (isPhoneRelated(m)) {
      if (isLikelyDuplicateOrUniqueConflict(m)) {
        step1DuplicatePhone = true
      } else {
        if (
          m.includes('invalid') ||
          m.includes('format') ||
          m.includes('صالح') ||
          m.includes('not valid') ||
          m.includes('must be valid')
        )
          step1PhoneToast = 'رقم الجوال غير صالح'
        else if (m.includes('required')) step1PhoneToast = 'رقم الجوال مطلوب'
        else
          step1PhoneToast =
            'تعذر التحقق من رقم الجوال. يرجى التعديل والمحاولة مرة أخرى'
      }
      continue
    }

    if (m.includes('email already exists')) arabicMsg = 'البريد الإلكتروني مستخدم بالفعل'
    if (m.includes('phone') && (m.includes('exists') || m.includes('unique')))
      arabicMsg = 'رقم الجوال مستخدم بالفعل'
    if (m.includes('invalid email')) arabicMsg = 'البريد الإلكتروني غير صالح'
    if (m.includes('nationalid') || m.includes('identitynumber')) {
      if (m.includes('exists') || m.includes('unique')) arabicMsg = 'رقم الهوية مستخدم بالفعل'
      else if (m.includes('digits')) arabicMsg = 'رقم الهوية يجب أن يتكون من 9 أرقام'
      else arabicMsg = 'خطأ في رقم الهوية'
    }
    if (m.includes('password')) {
      if (m.includes('short')) arabicMsg = 'كلمة المرور قصيرة جداً'
      else arabicMsg = 'كلمة المرور يجب أن تحتوي على حروف وأرقام ورموز'
    }
    if (m.includes('fullname') || m.includes('name')) {
      if (m.includes('required')) arabicMsg = 'الاسم الكامل مطلوب'
      else arabicMsg = 'الاسم غير صالح'
    }

    if (m.includes('fullname') || (m.includes('name') && !m.includes('username'))) {
      nameError = arabicMsg
    }
  }

  if (step1DuplicateEmail) {
    return {
      ok: false,
      message: 'البريد الإلكتروني مستخدم بالفعل',
      clearEmail: true,
      clearPhone: false,
    }
  }
  if (step1DuplicatePhone) {
    return {
      ok: false,
      message: 'رقم الجوال مستخدم بالفعل',
      clearEmail: false,
      clearPhone: true,
    }
  }
  if (step1EmailToast) {
    return {
      ok: false,
      message: step1EmailToast,
      clearEmail: true,
      clearPhone: false,
    }
  }
  if (step1PhoneToast) {
    return {
      ok: false,
      message: step1PhoneToast,
      clearEmail: false,
      clearPhone: true,
    }
  }

  if (nameError && !step1DuplicateEmail && !step1DuplicatePhone && !step1EmailToast && !step1PhoneToast) {
    return {
      ok: false,
      message: nameError,
      clearEmail: false,
      clearPhone: false,
      nameError,
    }
  }

  if (httpStatus === 409) {
    return {
      ok: false,
      message: 'البريد الإلكتروني أو رقم الجوال مسجّل مسبقاً',
      clearEmail: true,
      clearPhone: true,
    }
  }

  const meaningful = messages.filter((msg) => !isIgnorableProbeNoiseMessage(msg))
  const nonPassword = meaningful.filter((msg) => !msg.toLowerCase().includes('password'))

  if (httpStatus >= 400) {
    if (meaningful.length === 0) {
      return {
        ok: false,
        message: 'تعذر التحقق من البيانات. يرجى المحاولة مرة أخرى',
        clearEmail: false,
        clearPhone: false,
      }
    }
    if (nonPassword.length === 0) {
      // فقط أخطاء كلمة المرور الوهمية نعتبرها نجاحاً للـ probe
      return { ok: true }
    }
    
    // إذا كان هناك أخطاء غير كلمة المرور، نعرض أول واحد ونمسح الحقل المرتبط به إذا أمكن
    const firstErr = nonPassword[0]
    const isEmailErr = isEmailRelated(firstErr.toLowerCase())
    const isPhoneErr = isPhoneRelated(firstErr.toLowerCase())

    return {
      ok: false,
      message: firstErr,
      clearEmail: isEmailErr,
      clearPhone: isPhoneErr,
    }
  }

  return {
    ok: false,
    message: 'تعذر التحقق من البيانات. يرجى المحاولة مرة أخرى',
    clearEmail: false,
    clearPhone: false,
  }
}
