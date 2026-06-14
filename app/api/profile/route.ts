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

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
  }

  const userId = getUserIdFromAuthHeader(authHeader)

  try {
    // 1. One single GET request to the real backend with a short timeout
    const backendRes = await fetchWithTimeout(BACKEND_ME_URL, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Cache-Control': 'no-cache',
      },
    }, 2500)

    if (backendRes.ok) {
      const rawUser = await backendRes.json()
      const mapped = mapUserProfile(rawUser)
      if (mapped) {
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

        // Cache merged values in server DB
        db[mapped.id] = { ...local, ...merged }
        await writeDb(db)

        return NextResponse.json({ success: true, data: merged })
      }
    }
  } catch (err) {
    console.warn('[Profile GET] Remote backend unreachable or timed out. Falling back to server database:', err)
  }

  // Fallback: load directly from server DB when offline
  if (userId) {
    const db = await readDb()
    const local = db[userId]
    if (local) {
      const fallbackProfile = {
        id: userId,
        fullName: local.fullName ?? 'مستخدم نجاة',
        email: local.email ?? '',
        role: local.role ?? 'resident',
        phoneNumber: local.phoneNumber ?? null,
        gender: local.gender ?? null,
        ageGroup: local.ageGroup ?? null,
        maritalStatus: local.maritalStatus ?? null,
        healthStatus: local.healthStatus ?? null,
        nationalId: local.nationalId ?? null,
        housingStatus: local.housingStatus ?? null,
        familyMembersCount: local.familyMembersCount ?? null,
        femalesCount: local.femalesCount ?? null,
        malesCount: local.malesCount ?? null,
        region: local.region ?? null,
        avatarUrl: local.avatarUrl ?? null,
        assistancePreferences: local.assistancePreferences ?? null,
        assistanceLocation: local.assistanceLocation ?? null,
        assistanceRadius: local.assistanceRadius ?? null,
        emergencyContacts: local.emergencyContacts ?? null,
        sosMessage: local.sosMessage ?? null,
        bloodType: local.bloodType ?? null,
      }
      return NextResponse.json({ success: true, data: fallbackProfile })
    }
  }

  return NextResponse.json({ message: 'تعذر الاتصال بالخادم وقاعدة البيانات فارغة' }, { status: 504 })
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

    // If backend body contains offline supported fields, cache them too
    if (body.fullName !== undefined) local.fullName = body.fullName
    if (body.email !== undefined) local.email = body.email
    if (body.role !== undefined) local.role = body.role
    if (body.phoneNumber !== undefined) local.phoneNumber = body.phoneNumber
    if (body.gender !== undefined) local.gender = body.gender
    if (body.ageGroup !== undefined) local.ageGroup = body.ageGroup
    if (body.maritalStatus !== undefined) local.maritalStatus = body.maritalStatus
    if (body.healthStatus !== undefined) local.healthStatus = body.healthStatus
    if (body.nationalId !== undefined) local.nationalId = body.nationalId
    if (body.housingStatus !== undefined) local.housingStatus = body.housingStatus
    if (body.familyMembersCount !== undefined) local.familyMembersCount = body.familyMembersCount
    if (body.femalesCount !== undefined) local.femalesCount = body.femalesCount
    if (body.malesCount !== undefined) local.malesCount = body.malesCount
    if (body.region !== undefined) local.region = body.region

    db[userId] = local
    await writeDb(db)

    let refreshedMapped: any = null

    // 4. Update backend if there are any backend fields (1 single fetch!)
    if (Object.keys(backendBody).length > 0) {
      try {
        const updateRes = await fetchWithTimeout(BACKEND_ME_URL, {
          method: 'PATCH',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendBody),
        }, 3000)

        if (updateRes.ok) {
          const updateRaw = await updateRes.json()
          refreshedMapped = mapUserProfile(updateRaw)
        }
      } catch (err) {
        console.warn('[Profile PATCH] Remote backend update failed (offline). Saved locally.', err)
      }
    }

    // 5. If no backend fields were updated or update failed, fetch current user info from backend (1 single fetch!)
    if (!refreshedMapped) {
      try {
        const refreshedRes = await fetchWithTimeout(BACKEND_ME_URL, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Cache-Control': 'no-cache',
          },
        }, 2500)

        if (refreshedRes.ok) {
          const refreshedRaw = await refreshedRes.json()
          refreshedMapped = mapUserProfile(refreshedRaw)
        }
      } catch (err) {
        console.warn('[Profile PATCH] Remote backend GET failed (offline).', err)
      }
    }

    // 6. Merge and return (even if completely offline, we merge with local)
    const finalMerged = {
      id: userId,
      fullName: refreshedMapped?.fullName ?? local.fullName ?? 'مستخدم نجاة',
      email: refreshedMapped?.email ?? local.email ?? '',
      role: refreshedMapped?.role ?? local.role ?? 'resident',
      phoneNumber: refreshedMapped?.phoneNumber ?? local.phoneNumber ?? null,
      gender: refreshedMapped?.gender ?? local.gender ?? null,
      ageGroup: refreshedMapped?.ageGroup ?? local.ageGroup ?? null,
      maritalStatus: refreshedMapped?.maritalStatus ?? local.maritalStatus ?? null,
      healthStatus: refreshedMapped?.healthStatus ?? local.healthStatus ?? null,
      nationalId: refreshedMapped?.nationalId ?? local.nationalId ?? null,
      housingStatus: refreshedMapped?.housingStatus ?? local.housingStatus ?? null,
      familyMembersCount: refreshedMapped?.familyMembersCount ?? local.familyMembersCount ?? null,
      femalesCount: refreshedMapped?.femalesCount ?? local.femalesCount ?? null,
      malesCount: refreshedMapped?.malesCount ?? local.malesCount ?? null,
      region: refreshedMapped?.region ?? local.region ?? null,
      avatarUrl: local.avatarUrl ?? refreshedMapped?.avatarUrl ?? null,
      assistancePreferences: local.assistancePreferences ?? refreshedMapped?.assistancePreferences ?? null,
      assistanceLocation: local.assistanceLocation ?? refreshedMapped?.assistanceLocation ?? null,
      assistanceRadius: local.assistanceRadius ?? refreshedMapped?.assistanceRadius ?? null,
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
