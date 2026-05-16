import { NextResponse } from 'next/server'
import { aidHelpRequestFormSchema } from '@/schemas/aidHelpRequest'

function bilingualMessage(ar: string, en: string) {
  return { ar, en }
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
