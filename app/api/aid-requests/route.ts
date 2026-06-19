import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { normalizeUserRole } from '@/lib/auth/roleUtils'

type AidRequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled'

interface AidRequestRecord {
  id: string
  userId: string
  aidPointId: string
  aidOrganizationId: string
  aidOrganizationName: string
  husbandName: string
  wifeName: string
  phoneNumber: string
  currentLocation: string
  femaleChildrenCount: number
  maleChildrenCount: number
  notes: string
  requestedSupplies: unknown[]
  status: AidRequestStatus
  createdAt: string
  updatedAt: string
}

type AidRequestsDb = Record<string, AidRequestRecord[]>

const DB_PATH = path.join(process.cwd(), 'data', 'aid_requests_store.json')
const REAL_BACKEND_ROOT =
  'https://graduation-project-api-production-8251.up.railway.app/api/v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asUnknownArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function isAidRequestRecord(value: unknown): value is AidRequestRecord {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string'
  )
}

async function readDb(): Promise<AidRequestsDb> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return {}

    return Object.fromEntries(
      Object.entries(parsed).map(([userId, requests]) => [
        userId,
        Array.isArray(requests) ? requests.filter(isAidRequestRecord) : [],
      ]),
    )
  } catch {
    return {}
  }
}

async function writeDb(data: AidRequestsDb): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = 2500,
): Promise<Response> {
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

function getAllRequests(db: AidRequestsDb): AidRequestRecord[] {
  const allRequests = Object.values(db).flatMap((requests) =>
    Array.isArray(requests) ? requests : [],
  )
  return allRequests.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime()
    const dateB = new Date(b.createdAt || 0).getTime()
    return dateB - dateA
  })
}

async function updateStoredRequestStatus(
  requestId: string,
  status: AidRequestStatus,
): Promise<AidRequestRecord | null> {
  const db = await readDb()

  for (const userId of Object.keys(db)) {
    const requests = db[userId]
    if (!Array.isArray(requests)) continue

    const index = requests.findIndex((request) => request.id === requestId)
    if (index === -1) continue

    const updated = {
      ...requests[index],
      status,
      updatedAt: new Date().toISOString(),
    }
    requests[index] = updated
    db[userId] = requests
    await writeDb(db)
    return updated
  }

  return null
}

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
    const requests = role === 'admin' ? getAllRequests(db) : db[userId] || []
    return NextResponse.json({ success: true, data: requests })
  } catch (err) {
    console.error('Aid requests GET error:', err)
    return NextResponse.json({ message: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}

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

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ message: 'JSON غير صالح' }, { status: 400 })
  }

  try {
    const requestBody = body as Record<string, unknown>
    const { aidOrganizationName, ...forwardBody } = requestBody
    const db = await readDb()
    const userRequests = db[userId] || []
    const now = new Date().toISOString()

    const newRequest: AidRequestRecord = {
      id: `req_${Math.random().toString(36).substring(2, 11)}`,
      userId,
      aidPointId: aidOrganizationId,
      aidOrganizationId,
      aidOrganizationName: asString(aidOrganizationName),
      husbandName: asString(requestBody.husbandName),
      wifeName: asString(requestBody.wifeName),
      phoneNumber: asString(requestBody.phoneNumber),
      currentLocation: asString(requestBody.currentLocation, 'غير محدد'),
      femaleChildrenCount: asNumber(requestBody.femaleChildrenCount),
      maleChildrenCount: asNumber(requestBody.maleChildrenCount),
      notes: asString(requestBody.additionalNotes),
      requestedSupplies: asUnknownArray(requestBody.requestedSupplies),
      status: 'pending' as AidRequestStatus,
      createdAt: now,
      updatedAt: now,
    }

    userRequests.unshift(newRequest)
    db[userId] = userRequests
    await writeDb(db)

    try {
      const forwardRes = await fetchWithTimeout(
        `${REAL_BACKEND_ROOT}/aid/${encodeURIComponent(aidOrganizationId)}/requests`,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(forwardBody),
        },
        3000,
      )

      if (!forwardRes.ok) {
        const text = await forwardRes.text().catch(() => '')
        console.warn('[Aid Forward] Backend rejected request:', forwardRes.status, text)
      }
    } catch (err) {
      console.warn('Aid request forwarding failed; saved locally:', err)
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

export async function PUT(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
  }

  const { role } = getUserInfoFromAuthHeader(authHeader)
  if (role !== 'admin') {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  const status = body?.status

  if (!id || !['pending', 'approved', 'rejected', 'fulfilled'].includes(status)) {
    return NextResponse.json({ message: 'بيانات غير مكتملة' }, { status: 400 })
  }

  const updated = await updateStoredRequestStatus(id, status)
  if (!updated) {
    return NextResponse.json({ message: 'الطلب غير موجود' }, { status: 404 })
  }

  return NextResponse.json(updated)
}

export const PATCH = PUT
