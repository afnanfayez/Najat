/**
 * Request persistent storage so the browser does not evict our Cache Storage
 * and IndexedDB (offline shells, images, map tiles, queued mutations) under
 * storage pressure or after periods of inactivity.
 *
 * Safe to call repeatedly — it is a no-op once granted, and silently ignored
 * on browsers that do not support the Storage API.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) {
    return false
  }
  try {
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

/** Returns a rough storage usage snapshot for diagnostics, or null if unsupported. */
export async function getStorageEstimate(): Promise<
  { usage: number; quota: number; usagePct: number } | null
> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
    return null
  }
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate()
    const usagePct = quota > 0 ? Math.round((usage / quota) * 100) : 0
    return { usage, quota, usagePct }
  } catch {
    return null
  }
}
