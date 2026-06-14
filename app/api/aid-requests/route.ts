import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { mapUserProfile } from '@/lib/profile/mapUserProfile'
import { normalizeUserRole } from '@/lib/auth/roleUtils'

const DB_PATH = path.join(process.cwd(), 'data', 'aid_requests_store.json')
const BACKEND_ME_URL = 'https://graduation-project-api-production-8251.up.railway.app/api/v1/auth/me'

async function readDb(): Promise<Record<string, any[]>> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeDb(data: Record<string, any[]>) {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write aid requests store:', err)
  }
}

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

interface TokenPayload {
  userId: string | null
  role: string | null
}

// Local JWT decoder to get user ID and role in 0ms (no fetch needed!)
function getUserInfoFromAuthHeader(authHeader: string): TokenPayload {
  try {
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const payload = token.split('.')[1]
    if (!payload) return { userId: null, role: null }
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = Buffer.from(base64, 'base64').toString('utf-8')
    const json = JSON.parse(decoded)
    const userId = String(json.sub ?? json.id ?? json.userId ?? '')
    const role = normalizeUserRole(json.role ?? json.userRole ?? json.user?.role)
    return { userId: userId || null, role }
  } catch (err) {
    console.error('JWT parse error:', err)
    return { userId: null, role: null }
  }
}

// GET: list requests for the authenticated user (or all if admin)
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
  }

  const { userId, role } = getUserInfoFromAuthHeader(authHeader)
  if (!userId) {
    return NextResponse.json({ message: 'توكن غير صالح' }, { status: 401 })
  }

  try {
    const db = await readDb()
    let userRequests: any[] = []

    if (role === 'admin') {
      const allRequests: any[] = []
      for (const key of Object.keys(db)) {
        if (Array.isArray(db[key])) {
          allRequests.push(...db[key])
        }
      }
      allRequests.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      userRequests = allRequests
    } else {
      userRequests = db[userId] || []
    }

    return NextResponse.json({ success: true, data: userRequests })
  } catch (err) {
    console.error('Aid requests GET error:', err)
    return NextResponse.json({ message: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}

// POST: submit a new aid help request and save it locally + forward to backend
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
  }

  const { userId } = getUserInfoFromAuthHeader(authHeader)
  if (!userId) {
    return NextResponse.json({ message: 'توكن غير صالح' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const aidOrganizationId = searchParams.get('aidOrganizationId') || 'unknown'

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'JSON غير صالح' }, { status: 400 })
  }

  try {
    const {
      aidOrganizationName,
      ...forwardBody
    } = body

    // Save request locally
    const db = await readDb()
    const userRequests = db[userId] || []

    const newRequest = {
      id: `req_${Math.random().toString(36).substring(2, 11)}`,
      userId,
      aidOrganizationId,
      aidOrganizationName: aidOrganizationName || '',
      husbandName: body.husbandName || '',
      wifeName: body.wifeName || '',
      phoneNumber: body.phoneNumber || '',
      currentLocation: body.currentLocation || 'غير محدد',
      femaleChildrenCount: body.femaleChildrenCount || 0,
      maleChildrenCount: body.maleChildrenCount || 0,
      status: 'pending', // pending Review
      createdAt: new Date().toISOString(),
    }

    userRequests.unshift(newRequest)
    db[userId] = userRequests
    await writeDb(db)

    // Forward to backend
    const targetUrl = `https://graduation-project-api-production-8251.up.railway.app/api/v1/aid/${encodeURIComponent(aidOrganizationId)}/requests`
    try {
      const forwardRes = await fetchWithTimeout(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forwardBody),
      }, 3000)

      if (forwardRes.ok) {
        const resJson = await forwardRes.json()
        return NextResponse.json(resJson)
      } else {
        const text = await forwardRes.text()
        console.warn('[Aid Forward] Backend rejected request with status:', forwardRes.status, text)
        let errBody: any = null
        try { errBody = JSON.parse(text) } catch {}
        
        // If it is a client-side error (like 400 Bad Request or 404 Not Found), return it directly
        if (forwardRes.status >= 400 && forwardRes.status < 500) {
          return NextResponse.json(
            errBody || { message: 'فشل إرسال الطلب: بيانات غير صالحة' },
            { status: forwardRes.status }
          )
        }
      }
    } catch (err) {
      console.warn('Aid request forwarding failed due to network timeout/offline, saved locally:', err)
    }

    return NextResponse.json({
      success: true,
      message: 'تم ارسال طلبك',
      data: newRequest,
    })
  } catch (err) {
    console.error('Aid requests POST error:', err)
    return NextResponse.json({ message: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}
