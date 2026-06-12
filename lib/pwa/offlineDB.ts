/**
 * offlineDB.ts — re-export shell (Sprint 3)
 *
 * All implementations have been consolidated into lib/offline/db.ts (Dexie).
 * This file exists only to preserve import paths for callers that referenced
 * the old raw IndexedDB functions directly.
 */

export type {
  AuthSnapshot as OfflineAuthRecord,
  OfflineSyncQueueItem as SyncQueueItem,
  OfflineSyncType,
} from '@/lib/offline/db'

export {
  putAuthSnapshot as idbPutAuthSnapshot,
  getAuthSnapshot as idbGetAuthSnapshot,
  getLatestAuthSnapshot as idbGetLatestAuthSnapshot,
  updateAuthProfile as idbUpdateAuthProfile,
  deleteAuthSnapshot as idbDeleteAuthSnapshot,
  enqueueOfflineOp as idbEnqueueSync,
  getPendingOfflineOpsCount as idbGetPendingSyncCount,
} from '@/lib/offline/db'

export const STORE_AUTH = 'authSnapshots'
export const STORE_SYNC_QUEUE = 'offlineSyncQueue'
