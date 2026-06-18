/**
 * Canonical offline-first read pattern.
 *
 * Standardizes how data hooks should read so behavior is consistent across the
 * app (see hooks/useHealthFacilities.ts for the reference implementation this
 * codifies). Use it for NEW read hooks; the existing nuanced hooks already
 * implement this pattern by hand and need not be rewritten.
 *
 * Behavior:
 *  - Offline                  → return cached data immediately.
 *  - Online + has cache       → return cache now, refresh from network in the
 *                               background (stale-while-revalidate), persisting
 *                               the fresh result and notifying via onFresh.
 *  - Online + no cache        → await the network (optionally with a soft
 *                               timeout), persist, and return it; on failure
 *                               fall back to whatever cache exists.
 */
export type OfflineReadResult<T> = {
  data: T
  source: 'cache' | 'network' | 'empty'
  refreshing?: boolean
}

export type OfflineReadOptions<T> = {
  /** Read the locally cached value (IndexedDB). Return null/empty when absent. */
  readCache: () => Promise<T | null>
  /** Fetch the fresh value from the network. */
  readNetwork: () => Promise<T>
  /** Persist a freshly-fetched value to the local cache. */
  writeCache?: (data: T) => Promise<void>
  /** Called when a background refresh produces fresh data. */
  onFresh?: (data: T) => void
  /** Treats a cache value as "present". Defaults to non-null / non-empty-array. */
  hasData?: (data: T | null) => boolean
  /** The value used for the `empty` source when nothing is available. */
  emptyValue: T
}

function defaultHasData<T>(data: T | null): boolean {
  if (data == null) return false
  if (Array.isArray(data)) return data.length > 0
  return true
}

export async function offlineRead<T>(
  opts: OfflineReadOptions<T>,
): Promise<OfflineReadResult<T>> {
  const hasData = opts.hasData ?? defaultHasData
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  const cached = await opts.readCache()

  if (isOffline) {
    return hasData(cached)
      ? { data: cached as T, source: 'cache' }
      : { data: opts.emptyValue, source: 'empty' }
  }

  const persistAndNotify = (fresh: T) => {
    void opts.writeCache?.(fresh)
    opts.onFresh?.(fresh)
  }

  if (hasData(cached)) {
    // stale-while-revalidate: serve cache, refresh in background
    opts
      .readNetwork()
      .then(persistAndNotify)
      .catch(() => {
        // keep cached data visible on failure
      })
    return { data: cached as T, source: 'cache', refreshing: true }
  }

  try {
    const fresh = await opts.readNetwork()
    persistAndNotify(fresh)
    return { data: fresh, source: 'network' }
  } catch {
    return hasData(cached)
      ? { data: cached as T, source: 'cache' }
      : { data: opts.emptyValue, source: 'empty' }
  }
}
