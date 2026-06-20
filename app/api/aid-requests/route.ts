import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { normalizeUserRole } from '@/lib/auth/roleUtils'

type AidRequestStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'fulfilled'

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
type AidRequestStatusOverrides = Record<
  string,
  { status: AidRequestStatus; updatedAt: string }
>

const DB_PATH = path.join(process.cwd(), 'data', 'aid_requests_store.json')
const STATUS_OVERRIDES_PATH = path.join(
  process.cwd(),
  'data',
  'aid_request_status_overrides.json',
)
const STATUS_OVERRIDES_COOKIE = 'najat_aid_request_status_overrides'
const STATUS_OVERRIDES_MAX_ENTRIES = 30
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

async function tryWriteDb(data: AidRequestsDb): Promise<boolean> {
  try {
    await writeDb(data)
    return true
  } catch (err) {
    console.warn('[Aid Requests] Local JSON write unavailable:', err)
    return false
  }
}

function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {}
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        if (index === -1) return [part, '']
        return [part.slice(0, index), part.slice(index + 1)]
      }),
  )
}

function sanitizeStatusOverrides(value: unknown): AidRequestStatusOverrides {
  if (!isRecord(value)) return {}

  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (!isRecord(item)) return false
      return (
        typeof item.updatedAt === 'string' &&
        isAidRequestStatus(item.status)
      )
    }),
  ) as AidRequestStatusOverrides
}

function readStatusOverridesCookie(req: Request): AidRequestStatusOverrides {
  try {
    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const raw = cookies[STATUS_OVERRIDES_COOKIE]
    if (!raw) return {}
    return sanitizeStatusOverrides(JSON.parse(decodeURIComponent(raw)))
  } catch {
    return {}
  }
}

function limitStatusOverrides(
  data: AidRequestStatusOverrides,
): AidRequestStatusOverrides {
  return Object.fromEntries(
    Object.entries(data)
      .sort(
        ([, a], [, b]) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, STATUS_OVERRIDES_MAX_ENTRIES),
  )
}

function statusOverridesCookieValue(data: AidRequestStatusOverrides): string {
  const encoded = encodeURIComponent(JSON.stringify(limitStatusOverrides(data)))
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return [
    `${STATUS_OVERRIDES_COOKIE}=${encoded}`,
    'Path=/',
    'Max-Age=2592000',
    'SameSite=Lax',
    'HttpOnly',
    secure,
  ]
    .filter(Boolean)
    .join('; ')
}

function attachStatusOverridesCookie(
  res: NextResponse,
  data: AidRequestStatusOverrides,
): NextResponse {
  res.headers.append('Set-Cookie', statusOverridesCookieValue(data))
  return res
}

async function readStatusOverrides(req?: Request): Promise<AidRequestStatusOverrides> {
  const cookieOverrides = req ? readStatusOverridesCookie(req) : {}

  try {
    const raw = await fs.readFile(STATUS_OVERRIDES_PATH, 'utf-8')
    const parsed: unknown = JSON.parse(raw)
    return { ...sanitizeStatusOverrides(parsed), ...cookieOverrides }
  } catch {
    return cookieOverrides
  }
}

async function writeStatusOverrides(
  data: AidRequestStatusOverrides,
): Promise<void> {
  await fs.mkdir(path.dirname(STATUS_OVERRIDES_PATH), { recursive: true })
  await fs.writeFile(
    STATUS_OVERRIDES_PATH,
    JSON.stringify(data, null, 2),
    'utf-8',
  )
}

async function saveStatusOverride(
  requestId: string,
  status: AidRequestStatus,
  req?: Request,
): Promise<{
  override: { status: AidRequestStatus; updatedAt: string }
  overrides: AidRequestStatusOverrides
}> {
  const next = {
    status,
    updatedAt: new Date().toISOString(),
  }
  const overrides = await readStatusOverrides(req)
  overrides[requestId] = next
  const limited = limitStatusOverrides(overrides)

  if (!process.env.VERCEL) {
    await writeStatusOverrides(limited).catch((err) => {
      console.warn('[Aid Requests] Status override file write unavailable:', err)
    })
  }

  return { override: next, overrides: limited }
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

function isAidRequestStatus(value: unknown): value is AidRequestStatus {
  return (
    value === 'pending' ||
    value === 'in_progress' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'fulfilled'
  )
}

function applyStatusOverrideToRecord(
  record: unknown,
  overrides: AidRequestStatusOverrides,
): unknown {
  if (!isRecord(record) || typeof record.id !== 'string') return record
  const override = overrides[record.id]
  if (!override) return record
  return {
    ...record,
    status: override.status,
    updatedAt: override.updatedAt,
    locallyOverridden: true,
  }
}

function applyStatusOverrides(
  value: unknown,
  overrides: AidRequestStatusOverrides,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => applyStatusOverrides(item, overrides))
  }

  if (!isRecord(value)) return value

  const overridden = applyStatusOverrideToRecord(value, overrides)
  if (!isRecord(overridden)) return overridden

  const next: Record<string, unknown> = { ...overridden }
  if ('data' in next) {
    next.data = applyStatusOverrides(next.data, overrides)
  }
  return next
}

async function findBackendRequestById(
  requestId: string,
  authHeader: string,
): Promise<Record<string, unknown> | null> {
  const backendRes = await fetchWithTimeout(
    `${REAL_BACKEND_ROOT}/aid/requests`,
    {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Cache-Control': 'no-cache',
      },
    },
    9000,
  )
  if (!backendRes.ok) return null

  const body = await backendRes.json().catch(() => null)
  const data = isRecord(body) ? body.data : null
  const requests = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.data)
      ? data.data
      : []

  const request = requests.find(
    (item): item is Record<string, unknown> =>
      isRecord(item) && item.id === requestId,
  )
  return request ?? null
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
    const target = role === 'admin'
      ? `${REAL_BACKEND_ROOT}/aid/requests`
      : `${REAL_BACKEND_ROOT}/aid/requests`
    const backendRes = await fetchWithTimeout(
      target,
      {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          'Cache-Control': 'no-cache',
        },
      },
      9000,
    )

    if (backendRes.ok) {
      const body = await backendRes.json().catch(() => null)
      const overrides = await readStatusOverrides(req)
      return NextResponse.json(applyStatusOverrides(body ?? {}, overrides), {
        status: backendRes.status,
      })
    }
  } catch (err) {
    console.warn('[Aid Requests GET] Backend unavailable; falling back to local JSON:', err)
  }

  try {
    const db = await readDb()
    const overrides = await readStatusOverrides(req)
    const requests = applyStatusOverrides(
      role === 'admin' ? getAllRequests(db) : db[userId] || [],
      overrides,
    )
    return NextResponse.json({ success: true, data: requests })
  } catch (err) {
    console.error('Aid requests GET fallback error:', err)
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

      if (forwardRes.ok) {
        const backendBody = await forwardRes.json().catch(() => null)
        const backendData = isRecord(backendBody) ? backendBody.data : null
        const storedRequest = isRecord(backendData)
          ? { ...newRequest, ...backendData, aidOrganizationName: asString(aidOrganizationName) }
          : newRequest
        const db = await readDb()
        const userRequests = db[userId] || []
        userRequests.unshift(storedRequest as AidRequestRecord)
        db[userId] = userRequests
        await tryWriteDb(db)
        return NextResponse.json(backendBody ?? { success: true, data: storedRequest }, {
          status: forwardRes.status,
        })
      } else {
        const text = await forwardRes.text().catch(() => '')
        console.warn('[Aid Forward] Backend rejected request:', forwardRes.status, text)
      }
    } catch (err) {
      console.warn('Aid request forwarding failed; saved locally:', err)
    }

    const db = await readDb()
    const userRequests = db[userId] || []
    userRequests.unshift(newRequest)
    db[userId] = userRequests
    const savedLocally = await tryWriteDb(db)

    if (!savedLocally) {
      return NextResponse.json(
        {
          message:
            'تعذر إرسال الطلب إلى الخادم، والتخزين المحلي غير متاح في بيئة الإنتاج.',
        },
        { status: 503 },
      )
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

  if (!id || !isAidRequestStatus(status)) {
    return NextResponse.json({ message: 'بيانات غير مكتملة' }, { status: 400 })
  }

  if (process.env.VERCEL) {
    const backendRequest = await findBackendRequestById(id, authHeader).catch(
      () => null,
    )
    const { override, overrides } = await saveStatusOverride(id, status, req)
    return attachStatusOverridesCookie(
      NextResponse.json({
        ...(backendRequest ?? { id }),
        status: override.status,
        updatedAt: override.updatedAt,
        locallyOverridden: true,
      }),
      overrides,
    )
  }

  try {
    const updated = await updateStoredRequestStatus(id, status)
    if (!updated) {
      const backendRequest = await findBackendRequestById(id, authHeader).catch(
        () => null,
      )
      const { override, overrides } = await saveStatusOverride(id, status, req)
      return attachStatusOverridesCookie(
        NextResponse.json({
          ...(backendRequest ?? { id }),
          status: override.status,
          updatedAt: override.updatedAt,
          locallyOverridden: true,
        }),
        overrides,
      )
    }
    const { overrides } = await saveStatusOverride(id, status, req)
    return attachStatusOverridesCookie(NextResponse.json(updated), overrides)
  } catch (err) {
    console.warn('[Aid Requests PUT] Falling back to status override:', err)
    const { override, overrides } = await saveStatusOverride(id, status, req)
    return attachStatusOverridesCookie(
      NextResponse.json({
        id,
        status: override.status,
        updatedAt: override.updatedAt,
        locallyOverridden: true,
      }),
      overrides,
    )
  }
}

export const PATCH = PUT
