/**
 * Namespaced localStorage-backed "table" for the mock data layer. Each resource
 * gets its own bucket, seeded once from realistic fixture data and mutated in
 * place afterwards so create/update/delete actions persist across reloads.
 */

interface Bucket<T> {
  seedVersion: number
  items: T[]
}

function keyFor(name: string): string {
  return `najat_mock_v1_${name}`
}

function readBucket<T>(name: string, seedVersion: number, seed: () => T[]): T[] {
  if (typeof window === 'undefined') return seed()
  try {
    const raw = window.localStorage.getItem(keyFor(name))
    if (raw) {
      const parsed = JSON.parse(raw) as Bucket<T>
      if (parsed.seedVersion === seedVersion && Array.isArray(parsed.items)) {
        return parsed.items
      }
    }
  } catch {
    // corrupt/unreadable — fall through and reseed
  }
  const seeded = seed()
  writeBucket(name, seedVersion, seeded)
  return seeded
}

function writeBucket<T>(name: string, seedVersion: number, items: T[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      keyFor(name),
      JSON.stringify({ seedVersion, items } satisfies Bucket<T>),
    )
  } catch (err) {
    console.warn(`[mock-store] failed to persist bucket "${name}"`, err)
  }
}

export interface BucketStore<T> {
  getAll(): T[]
  setAll(items: T[]): void
  /** Discards any persisted data and reseeds — a dev-only escape hatch. */
  reset(): void
}

/**
 * Bump `seedVersion` whenever a seed's shape changes during development —
 * it automatically invalidates stale localStorage data for that resource.
 */
export function createBucketStore<T>(
  name: string,
  seedVersion: number,
  seed: () => T[],
): BucketStore<T> {
  let cache: T[] | null = null

  return {
    getAll(): T[] {
      if (!cache) cache = readBucket(name, seedVersion, seed)
      return cache
    },
    setAll(items: T[]): void {
      cache = items
      writeBucket(name, seedVersion, items)
    },
    reset(): void {
      cache = seed()
      writeBucket(name, seedVersion, cache)
    },
  }
}

export interface SingletonStore<T> {
  get(): T
  set(value: T): void
}

/** Like createBucketStore, but for a single mutable dashboard-shaped object. */
export function createSingletonStore<T>(
  name: string,
  seedVersion: number,
  seed: () => T,
): SingletonStore<T> {
  const bucket = createBucketStore<T>(name, seedVersion, () => [seed()])
  return {
    get(): T {
      return bucket.getAll()[0] ?? seed()
    },
    set(value: T): void {
      bucket.setAll([value])
    },
  }
}
