import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { mapUserProfile } from '@/lib/profile/mapUserProfile'

const DB_PATH = path.join(process.cwd(), 'data', 'profile_store.json')
const BACKEND_ME_URL = 'https://graduation-project-api-production-8251.up.railway.app/api/v1/auth/me'

async function readDb(): Promise<Record<string, any>> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeDb(data: Record<string, any>) {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write profile store:', err)
  }
}

// Local JWT decoder to get user ID in 0ms (no fetch needed!)
function getUserIdFromAuthHeader(authHeader: string): string | null {
  try {
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = Buffer.from(base64, 'base64').toString('utf-8')
    const json = JSON.parse(decoded)
    return String(json.sub ?? json.id ?? json.userId ?? '')
  } catch (err) {
    console.error('JWT parse error:', err)
    return null
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
  }

  try {
    // 1. One single GET request to the real backend
    const backendRes = await fetch(BACKEND_ME_URL, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Cache-Control': 'no-cache',
      },
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()
      let errBody = { message: 'فشل التحقق من الجلسة' }
      try { errBody = JSON.parse(text) } catch {}
      return NextResponse.json(errBody, { status: backendRes.status })
    }

    const rawUser = await backendRes.json()
    const mapped = mapUserProfile(rawUser)
    if (!mapped) {
      return NextResponse.json(
        { message: 'تعذر تحليل بيانات الملف الشخصي من الخادم الرئيسي' },
        { status: 500 }
      )
    }

    // 2. Read local server db and merge
    const db = await readDb()
    const local = db[mapped.id] || {}

    const merged = {
      ...mapped,
      avatarUrl: local.avatarUrl ?? mapped.avatarUrl ?? null,
      assistancePreferences: local.assistancePreferences ?? mapped.assistancePreferences ?? null,
      assistanceLocation: local.assistanceLocation ?? mapped.assistanceLocation ?? null,
      assistanceRadius: local.assistanceRadius ?? mapped.assistanceRadius ?? null,
      emergencyContacts: local.emergencyContacts ?? null,
      sosMessage: local.sosMessage ?? null,
      bloodType: local.bloodType ?? null,
    }

    return NextResponse.json({ success: true, data: merged })
  } catch (err) {
    console.error('Profile GET proxy error:', err)
    return NextResponse.json({ message: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'JSON غير صالح' }, { status: 400 })
  }

  try {
    // 1. Decode user ID instantly without external fetch (0ms!)
    const userId = getUserIdFromAuthHeader(authHeader)
    if (!userId) {
      return NextResponse.json({ message: 'توكن غير صالح' }, { status: 401 })
    }

    // 2. Split body into local-only and backend fields
    const {
      avatarUrl,
      avatarDataUrl,
      assistancePreferences,
      assistanceLocation,
      assistanceRadius,
      emergencyContacts,
      sosMessage,
      bloodType,
      ...backendBody
    } = body

    // 3. Save local fields to local DB
    const db = await readDb()
    const local = db[userId] || {}

    if (avatarUrl !== undefined) local.avatarUrl = avatarUrl
    if (avatarDataUrl !== undefined) local.avatarUrl = avatarDataUrl
    if (assistancePreferences !== undefined) local.assistancePreferences = assistancePreferences
    if (assistanceLocation !== undefined) local.assistanceLocation = assistanceLocation
    if (assistanceRadius !== undefined) local.assistanceRadius = Number(assistanceRadius)
    if (emergencyContacts !== undefined) local.emergencyContacts = emergencyContacts
    if (sosMessage !== undefined) local.sosMessage = sosMessage
    if (bloodType !== undefined) local.bloodType = bloodType

    db[userId] = local
    await writeDb(db)

    let refreshedMapped: any = null

    // 4. Update backend if there are any backend fields (1 single fetch!)
    if (Object.keys(backendBody).length > 0) {
      const updateRes = await fetch(BACKEND_ME_URL, {
        method: 'PATCH',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendBody),
      })

      if (!updateRes.ok) {
        const text = await updateRes.text()
        let errBody = { message: 'فشل تعديل الملف الشخصي على الخادم الرئيسي' }
        try { errBody = JSON.parse(text) } catch {}
        return NextResponse.json(errBody, { status: updateRes.status })
      }

      // The PATCH response contains the refreshed profile data directly!
      const updateRaw = await updateRes.json()
      refreshedMapped = mapUserProfile(updateRaw)
    }

    // 5. If no backend fields were updated, fetch current user info from backend (1 single fetch!)
    if (!refreshedMapped) {
      const refreshedRes = await fetch(BACKEND_ME_URL, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Cache-Control': 'no-cache',
        },
      })

      if (!refreshedRes.ok) {
        return NextResponse.json({ message: 'فشل تحديث الجلسة' }, { status: refreshedRes.status })
      }

      const refreshedRaw = await refreshedRes.json()
      refreshedMapped = mapUserProfile(refreshedRaw)
    }

    if (!refreshedMapped) {
      return NextResponse.json({ message: 'تعذر تحليل بيانات الملف الشخصي' }, { status: 500 })
    }

    // 6. Merge and return
    const finalMerged = {
      ...refreshedMapped,
      avatarUrl: local.avatarUrl ?? refreshedMapped.avatarUrl ?? null,
      assistancePreferences: local.assistancePreferences ?? refreshedMapped.assistancePreferences ?? null,
      assistanceLocation: local.assistanceLocation ?? refreshedMapped.assistanceLocation ?? null,
      assistanceRadius: local.assistanceRadius ?? refreshedMapped.assistanceRadius ?? null,
      emergencyContacts: local.emergencyContacts ?? null,
      sosMessage: local.sosMessage ?? null,
      bloodType: local.bloodType ?? null,
    }

    return NextResponse.json({ success: true, data: finalMerged })
  } catch (err) {
    console.error('Profile PATCH proxy error:', err)
    return NextResponse.json({ message: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}
