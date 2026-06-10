import { profileAPI } from '@/lib/api/profile'
import { submitAidHelpRequest } from '@/lib/api/submitAidHelpRequest'
import { updateOfflineLoginProfile } from '@/lib/auth/offlineLogin'
import { clearLocalOverrides } from '@/lib/profile/localProfileStorage'
import {
  idbGetPendingSyncItems,
  idbMarkSyncDone,
  type SyncQueueItem,
} from '@/lib/pwa/offlineDB'
import type { AidHelpRequestForm } from '@/schemas/aidHelpRequest'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'

async function processItem(item: SyncQueueItem): Promise<boolean> {
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

  return false
}

export async function processSyncQueue(): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return

  const items = await idbGetPendingSyncItems()
  for (const item of items) {
    if (item.id == null) continue
    try {
      const ok = await processItem(item)
      if (ok) await idbMarkSyncDone(item.id)
    } catch {
      // keep pending for next retry
    }
  }
}
