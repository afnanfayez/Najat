/**
 * Profile proxy for GET/PATCH /api/profile.
 *
 * Source-of-truth model:
 *  - Backend fields (fullName, phoneNumber, nationalId, ...) → the remote API is
 *    authoritative. They are cached in profile_store.json ONLY after a confirmed
 *    backend response, purely as an offline-read fallback — never reported as
 *    saved unless the backend accepted them.
 *  - Local-only fields (avatar, assistance*, emergency contacts, sosMessage,
 *    bloodType) → the client's localStorage is authoritative and is overlaid last
 *    on the client; the copy stored here is a best-effort fallback only.
 */
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
    }, 9000)

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

    // 3. Persist LOCAL-ONLY fields immediately. These never touch the backend,
    //    so they can be saved regardless of backend availability.
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
    const hasBackendFields = Object.keys(backendBody).length > 0

    // 4. The backend is authoritative for backend fields. Only report success if
    //    it actually accepted the change — never fake success on error/timeout.
    if (hasBackendFields) {
      let updateRes: Response
      try {
        updateRes = await fetchWithTimeout(BACKEND_ME_URL, {
          method: 'PATCH',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendBody),
        }, 9000)
      } catch (err) {
        // Network error / timeout while the client believed it was online →
        // the change was NOT saved. Tell the caller so it can retry / queue.
        console.warn('[Profile PATCH] Backend unreachable; backend fields NOT saved.', err)
        return NextResponse.json(
          { message: 'تعذّر الوصول إلى الخادم، لم يتم حفظ التعديلات. حاول مرة أخرى.' },
          { status: 504 },
        )
      }

      let updateData: any = null
      try {
        updateData = await updateRes.json()
      } catch {
        /* non-JSON backend response */
      }

      if (!updateRes.ok) {
        // Surface the backend's real validation result instead of faking success.
        const errors = Array.isArray(updateData?.errors) ? updateData.errors : null
        const firstFieldMsg =
          errors && errors[0]?.message
            ? errors[0].message.ar ?? errors[0].message.en
            : undefined
        const rawMsg = updateData?.message
        const generalMsg =
          rawMsg && typeof rawMsg === 'object' ? rawMsg.ar ?? rawMsg.en : rawMsg
        return NextResponse.json(
          {
            message: firstFieldMsg ?? generalMsg ?? 'فشل حفظ التعديلات على الخادم',
            errors,
          },
          { status: updateRes.status },
        )
      }

      refreshedMapped = mapUserProfile(updateData)
    } else {
      // Local-only update → fetch a fresh backend snapshot for an accurate merge,
      // but tolerate failure (local-only changes don't depend on the backend).
      try {
        const refreshedRes = await fetchWithTimeout(BACKEND_ME_URL, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Cache-Control': 'no-cache',
          },
        }, 9000)

        if (refreshedRes.ok) {
          const refreshedRaw = await refreshedRes.json()
          refreshedMapped = mapUserProfile(refreshedRaw)
        }
      } catch (err) {
        console.warn('[Profile PATCH] Backend GET refresh failed (local-only update).', err)
      }
    }

    // 5. Cache the AUTHORITATIVE backend fields locally (offline fallback reads).
    //    Only done after a confirmed backend response so we never cache values
    //    the backend rejected.
    if (refreshedMapped) {
      local.fullName = refreshedMapped.fullName ?? local.fullName
      local.email = refreshedMapped.email ?? local.email
      local.role = refreshedMapped.role ?? local.role
      local.phoneNumber = refreshedMapped.phoneNumber ?? local.phoneNumber
      local.gender = refreshedMapped.gender ?? local.gender
      local.ageGroup = refreshedMapped.ageGroup ?? local.ageGroup
      local.maritalStatus = refreshedMapped.maritalStatus ?? local.maritalStatus
      local.healthStatus = refreshedMapped.healthStatus ?? local.healthStatus
      local.nationalId = refreshedMapped.nationalId ?? local.nationalId
      local.housingStatus = refreshedMapped.housingStatus ?? local.housingStatus
      local.familyMembersCount = refreshedMapped.familyMembersCount ?? local.familyMembersCount
      local.femalesCount = refreshedMapped.femalesCount ?? local.femalesCount
      local.malesCount = refreshedMapped.malesCount ?? local.malesCount
      local.region = refreshedMapped.region ?? local.region
      db[userId] = local
      await writeDb(db)
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
