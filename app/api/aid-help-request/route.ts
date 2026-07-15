import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { aidHelpRequestFormSchema } from '@/schemas/aidHelpRequest'
import { isMockMode } from '@/lib/mocks/isMockMode'

const DB_PATH = path.join(process.cwd(), 'data', 'aid_help_requests_store.json')

function bilingualMessage(ar: string, en: string) {
  return { ar, en }
}

async function persistMockRequest(data: Record<string, unknown>) {
  let records: unknown[] = []
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) records = parsed
  } catch {
    // no existing store yet
  }
  const record = {
    id: `help-req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...data,
    createdAt: new Date().toISOString(),
  }
  records.unshift(record)
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(records, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[Aid Help Request] Local JSON write unavailable:', err)
  }
  return record
}

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json(
      { message: bilingualMessage('جسون غير صالح', 'Invalid JSON') },
      { status: 400 },
    )
  }

  const parsed = aidHelpRequestFormSchema.safeParse(json)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'بيانات غير صالحة'
    return NextResponse.json({ message: bilingualMessage(first, first) }, { status: 400 })
  }

  const target = process.env.AID_HELP_REQUEST_BACKEND_URL?.replace(/\/$/, '')
  if (!target) {
    if (isMockMode()) {
      const record = await persistMockRequest(parsed.data as Record<string, unknown>)
      return NextResponse.json({ success: true, data: record })
    }
    return NextResponse.json(
      {
        message: bilingualMessage(
          'خدمة إرسال الطلبات غير مفعّلة على الخادم. راجع المتغير AID_HELP_REQUEST_BACKEND_URL.',
          'Aid request forwarding is not configured (AID_HELP_REQUEST_BACKEND_URL).',
        ),
      },
      { status: 503 },
    )
  }

  const auth = req.headers.get('authorization')
  let res: Response
  try {
    res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(parsed.data),
    })
  } catch {
    return NextResponse.json(
      {
        message: bilingualMessage(
          'تعذر الاتصال بخادم الطلبات',
          'Could not reach aid request backend',
        ),
      },
      { status: 502 },
    )
  }

  const text = await res.text()
  let body: unknown = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = { message: text || res.statusText }
  }

  return NextResponse.json(body ?? {}, { status: res.status })
}
