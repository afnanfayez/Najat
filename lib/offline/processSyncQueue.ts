import { hospitalsAPI } from '@/lib/api/hospitals'
import { aidAPI, type AidStatus } from '@/lib/api/aid'
import { profileAPI } from '@/lib/api/profile'
import { submitAidHelpRequest } from '@/lib/api/submitAidHelpRequest'
import { updateOfflineLoginProfile } from '@/lib/auth/offlineLogin'
import { clearLocalOverrides } from '@/lib/profile/localProfileStorage'
import {
  idbGetPendingSyncItems,
  idbMarkSyncDone,
  idbMarkSyncFailed,
  idbIncrementSyncRetry,
  type SyncQueueItem,
} from '@/lib/pwa/offlineDB'
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

// ──────────────────────────────────────────────────────────────────────────────
// IDB sync queue (auth + profile + aid requests)
// ──────────────────────────────────────────────────────────────────────────────

async function processIdbItem(item: SyncQueueItem): Promise<boolean> {
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

  return false
}

// ──────────────────────────────────────────────────────────────────────────────
// Dexie sync queue (admin mutations)
// ──────────────────────────────────────────────────────────────────────────────

async function processDexieItem(item: OfflineSyncQueueItem): Promise<boolean> {
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

  return false
}

// ──────────────────────────────────────────────────────────────────────────────
// Public entry point
// ──────────────────────────────────────────────────────────────────────────────

export async function processSyncQueue(): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return

  // Process IDB queue (auth + profile + aid requests)
  const idbItems = await idbGetPendingSyncItems()
  for (const item of idbItems) {
    if (item.id == null) continue

    if ((item.retries ?? 0) >= MAX_RETRIES) {
      await idbMarkSyncFailed(item.id, 'max retries exceeded')
      continue
    }

    try {
      const ok = await processIdbItem(item)
      if (ok) {
        await idbMarkSyncDone(item.id)
      } else {
        await idbIncrementSyncRetry(item.id)
      }
    } catch (err) {
      await idbIncrementSyncRetry(item.id)
      if ((item.retries ?? 0) + 1 >= MAX_RETRIES) {
        const msg = err instanceof Error ? err.message : 'sync failed'
        await idbMarkSyncFailed(item.id, msg)
      }
    }
  }

  // Process Dexie queue (admin mutations)
  const dexieItems = await getPendingOfflineOps()
  for (const item of dexieItems) {
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
