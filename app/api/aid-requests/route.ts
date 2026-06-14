import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { mapUserProfile } from '@/lib/profile/mapUserProfile'

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

// GET: list requests for the authenticated user
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
  }

  const userId = getUserIdFromAuthHeader(authHeader)
  if (!userId) {
    return NextResponse.json({ message: 'توكن غير صالح' }, { status: 401 })
  }

  try {
    const db = await readDb()
    const userRequests = db[userId] || []

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

  const userId = getUserIdFromAuthHeader(authHeader)
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
      const forwardRes = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forwardBody),
      })

      if (forwardRes.ok) {
        const resJson = await forwardRes.json()
        return NextResponse.json(resJson)
      }
    } catch (err) {
      console.warn('Aid request forwarding failed, but saved locally:', err)
    }

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلبك وحفظه محلياً بنجاح',
      data: newRequest,
    })
  } catch (err) {
    console.error('Aid requests POST error:', err)
    return NextResponse.json({ message: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}
