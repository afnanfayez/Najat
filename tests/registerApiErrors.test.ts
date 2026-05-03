import { describe, expect, it } from 'vitest'
import {
  flattenRegisterApiMessages,
  interpretStepOneRegisterProbe,
  mapKnownRegisterErrorCode,
} from '@/lib/auth/registerApiErrors'

describe('mapKnownRegisterErrorCode', () => {
  it('maps EMAIL_ALREADY_EXISTS to email conflict', () => {
    expect(mapKnownRegisterErrorCode('EMAIL_ALREADY_EXISTS')).toEqual({
      clearEmail: true,
      clearPhone: false,
      message: 'البريد الإلكتروني مستخدم بالفعل',
    })
  })

  it('maps PHONE_ALREADY_EXISTS to phone conflict', () => {
    expect(mapKnownRegisterErrorCode('PHONE_ALREADY_EXISTS')).toEqual({
      clearEmail: false,
      clearPhone: true,
      message: 'رقم الجوال مستخدم بالفعل',
    })
  })

  it('returns null for unrecognized code', () => {
    expect(mapKnownRegisterErrorCode('SOME_OTHER')).toBeNull()
  })
})

describe('flattenRegisterApiMessages', () => {
  it('flattens nested detail arrays', () => {
    const err = {
      detail: [{ loc: ['body', 'email'], msg: 'exists' }],
    }
    expect(flattenRegisterApiMessages(err)).toEqual(['exists'])
  })
})

describe('interpretStepOneRegisterProbe', () => {
  it('prefers known error code from fullData', () => {
    const err = {
      status: 400,
      fullData: { error: 'EMAIL_ALREADY_EXISTS' },
    }
    expect(interpretStepOneRegisterProbe(err)).toEqual({
      ok: false,
      message: 'البريد الإلكتروني مستخدم بالفعل',
      clearEmail: true,
      clearPhone: false,
    })
  })

  it('does not skip email when message also mentions password', () => {
    const err = {
      status: 400,
      detail: [
        {
          msg: 'email already registered and password too short',
        },
      ],
    }
    const r = interpretStepOneRegisterProbe(err)
    expect(r.ok).toBe(false)
    if (r.ok) throw new Error('expected failure')
    expect(r.clearEmail).toBe(true)
    expect(r.message).toContain('البريد')
  })
})
