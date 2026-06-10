import { profileAPI } from '@/lib/api/profile'
import { submitAidHelpRequest } from '@/lib/api/submitAidHelpRequest'
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
    await profileAPI.update(item.payload as UpdateUserProfileBody)
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
