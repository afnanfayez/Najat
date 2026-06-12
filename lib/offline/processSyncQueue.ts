import { hospitalsAPI } from '@/lib/api/hospitals'
import { aidAPI, type AidStatus } from '@/lib/api/aid'
import { profileAPI } from '@/lib/api/profile'
import { submitAidHelpRequest } from '@/lib/api/submitAidHelpRequest'
import {
  safetyAPI,
  type CreateDangerZoneBody,
  type UpdateDangerZoneBody,
  type CreateSafeRoadBody,
  type CreateResourcePointBody,
} from '@/lib/api/safety'
import { updateOfflineLoginProfile } from '@/lib/auth/offlineLogin'
import { clearLocalOverrides } from '@/lib/profile/localProfileStorage'
import {
  getPendingOfflineOps,
  markOfflineOpSyncing,
  markOfflineOpDone,
  markOfflineOpFailed,
  markOfflineOpConflict,
  incrementOfflineOpRetry,
  type OfflineSyncQueueItem,
} from '@/lib/offline/db'
import type { AidHelpRequestForm } from '@/schemas/aidHelpRequest'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'
import type { HospitalCapacityStatus } from '@/schemas/hospitalApi'

const MAX_RETRIES = 3

async function processDexieItem(item: OfflineSyncQueueItem): Promise<boolean> {
  if (item.type === 'AID_REQUEST') {
    const result = await submitAidHelpRequest(item.payload as AidHelpRequestForm)
    return result.ok
  }

  if (item.type === 'PROFILE_SYNC') {
    const body = item.payload as UpdateUserProfileBody
    const result = await profileAPI.update(body)
    await updateOfflineLoginProfile(result.profile)
    clearLocalOverrides(
      result.profile.id,
      Object.keys(body) as (keyof UpdateUserProfileBody)[],
    )
    return true
  }

  if (item.type === 'UPDATE_FACILITY_STATUS') {
    const { id, status } = item.payload as { id: string; status: HospitalCapacityStatus }
    await hospitalsAPI.updateStatus(id, { status })
    return true
  }

  if (item.type === 'DELETE_FACILITY') {
    const { id } = item.payload as { id: string }
    await hospitalsAPI.softDelete(id)
    return true
  }

  if (item.type === 'CREATE_AID_POINT') {
    const { body } = item.payload as { body: Record<string, unknown> }
    await aidAPI.create(body)
    return true
  }

  if (item.type === 'UPDATE_AID_POINT') {
    const { id, body } = item.payload as { id: string; body: Record<string, unknown> }
    await aidAPI.update(id, body)
    return true
  }

  if (item.type === 'DELETE_AID_POINT') {
    const { id } = item.payload as { id: string }
    await aidAPI.softDelete(id)
    return true
  }

  if (item.type === 'UPDATE_AID_STATUS') {
    const { id, status } = item.payload as { id: string; status: AidStatus }
    await aidAPI.updateStatus(id, { status })
    return true
  }

  if (item.type === 'CREATE_DANGER_ZONE') {
    const { body } = item.payload as { body: CreateDangerZoneBody }
    await safetyAPI.createZone(body)
    return true
  }

  if (item.type === 'UPDATE_DANGER_ZONE') {
    const { id, body } = item.payload as { id: string; body: UpdateDangerZoneBody }
    await safetyAPI.updateZone(id, body)
    return true
  }

  if (item.type === 'DELETE_DANGER_ZONE') {
    const { id } = item.payload as { id: string }
    await safetyAPI.deleteZone(id)
    return true
  }

  if (item.type === 'CREATE_SAFE_ROAD') {
    const { body } = item.payload as { body: CreateSafeRoadBody }
    await safetyAPI.createSafeRoad(body)
    return true
  }

  if (item.type === 'DELETE_SAFE_ROAD') {
    const { id } = item.payload as { id: string }
    await safetyAPI.deleteSafeRoad(id)
    return true
  }

  if (item.type === 'CREATE_RESOURCE_POINT') {
    const { body } = item.payload as { body: CreateResourcePointBody }
    await safetyAPI.createResourcePoint(body)
    return true
  }

  if (item.type === 'DELETE_RESOURCE_POINT') {
    const { id } = item.payload as { id: string }
    await safetyAPI.deleteResourcePoint(id)
    return true
  }

  return false
}

export async function processSyncQueue(): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return

  const items = await getPendingOfflineOps()
  for (const item of items) {
    if (item.id == null) continue

    if (item.retries >= MAX_RETRIES) {
      await markOfflineOpFailed(item.id, 'max retries exceeded')
      continue
    }

    await markOfflineOpSyncing(item.id)

    try {
      const ok = await processDexieItem(item)
      if (ok) {
        await markOfflineOpDone(item.id)
      } else {
        await incrementOfflineOpRetry(item.id)
      }
    } catch (err) {
      await incrementOfflineOpRetry(item.id)
      const msg = err instanceof Error ? err.message : 'sync failed'

      if (item.retries + 1 >= MAX_RETRIES) {
        await markOfflineOpFailed(item.id, msg)
      } else if (msg.includes('409') || msg.toLowerCase().includes('conflict')) {
        await markOfflineOpConflict(item.id)
      }
    }
  }
}
