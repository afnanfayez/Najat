/**
 * offlineDB.ts — IndexedDB wrapper for Najat PWA
 *
 * Stores auth snapshots (JWT + password hash + profile) in IndexedDB so users
 * can log in offline after at least one successful online login.
 * Also manages a Background Sync queue for re-syncing data when internet returns.
 */

const DB_NAME = 'najat-offline-db'
const DB_VERSION = 1
export const STORE_AUTH = 'auth-snapshots'
export const STORE_SYNC_QUEUE = 'sync-queue'

let _db: IDBDatabase | null = null

// ──────────────────────────────────────────────────────────────────────────────
// DB Init
// ──────────────────────────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db)

  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB غير متاح في هذه البيئة'))
      return
    }

    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result

      // Store auth snapshots keyed by email
      if (!db.objectStoreNames.contains(STORE_AUTH)) {
        db.createObjectStore(STORE_AUTH, { keyPath: 'email' })
      }

      // Store background sync queue items
      if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
        const store = db.createObjectStore(STORE_SYNC_QUEUE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('status', 'status', { unique: false })
      }
    }

    req.onsuccess = () => {
      _db = req.result
      resolve(_db)
    }

    req.onerror = () => reject(req.error)
  })
}

// ──────────────────────────────────────────────────────────────────────────────
// Auth Snapshot — CRUD
// ──────────────────────────────────────────────────────────────────────────────

export type OfflineAuthRecord = {
  email: string           // keyPath
  passwordHash: string
  token: string
  role: string
  profile: unknown | null
  _savedAt: number        // timestamp for "most recent" lookup
}

/**
 * Save (upsert) an auth snapshot into IndexedDB.
 * Falls back to localStorage if IndexedDB is unavailable.
 */
export async function idbPutAuthSnapshot(snapshot: Omit<OfflineAuthRecord, '_savedAt'>): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_AUTH, 'readwrite')
      tx.objectStore(STORE_AUTH).put({ ...snapshot, _savedAt: Date.now() })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // localStorage fallback
    try {
      localStorage.setItem('najat_offline_login', JSON.stringify({ ...snapshot, _savedAt: Date.now() }))
    } catch {
      // storage unavailable — silently ignore
    }
  }
}

/**
 * Retrieve an auth snapshot by email.
 * Falls back to localStorage if IndexedDB is unavailable.
 */
export async function idbGetAuthSnapshot(email: string): Promise<OfflineAuthRecord | null> {
  const key = email.trim().toLowerCase()
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_AUTH, 'readonly')
      const req = tx.objectStore(STORE_AUTH).get(key)
      req.onsuccess = () => resolve((req.result as OfflineAuthRecord) ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    // localStorage fallback
    try {
      const raw = localStorage.getItem('najat_offline_login')
      if (!raw) return null
      const parsed = JSON.parse(raw) as OfflineAuthRecord
      return parsed.email === key ? parsed : null
    } catch {
      return null
    }
  }
}

/**
 * Get the most recently saved auth snapshot (any email).
 * Used when loading the app offline without knowing who the current user is.
 */
export async function idbGetLatestAuthSnapshot(): Promise<OfflineAuthRecord | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_AUTH, 'readonly')
      const req = tx.objectStore(STORE_AUTH).getAll()
      req.onsuccess = () => {
        const all = (req.result ?? []) as OfflineAuthRecord[]
        if (all.length === 0) { resolve(null); return }
        const sorted = [...all].sort((a, b) => (b._savedAt ?? 0) - (a._savedAt ?? 0))
        resolve(sorted[0])
      }
      req.onerror = () => reject(req.error)
    })
  } catch {
    // localStorage fallback
    try {
      const raw = localStorage.getItem('najat_offline_login')
      return raw ? (JSON.parse(raw) as OfflineAuthRecord) : null
    } catch {
      return null
    }
  }
}

/**
 * Update the stored profile for an existing snapshot (after online sync).
 */
export async function idbUpdateAuthProfile(email: string, profile: unknown): Promise<void> {
  const snapshot = await idbGetAuthSnapshot(email)
  if (!snapshot) return
  await idbPutAuthSnapshot({ ...snapshot, profile })
}

/**
 * Delete an auth snapshot for a specific email.
 * NOTE: Do NOT call this on logout — only call when the user explicitly
 * revokes offline access or when a 401 confirms the token is expired.
 */
export async function idbDeleteAuthSnapshot(email: string): Promise<void> {
  const key = email.trim().toLowerCase()
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_AUTH, 'readwrite')
      tx.objectStore(STORE_AUTH).delete(key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    localStorage.removeItem('najat_offline_login')
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Background Sync Queue
// ──────────────────────────────────────────────────────────────────────────────

export type SyncQueueItem = {
  id?: number
  type:
    | 'SESSION_REFRESH'
    | 'PROFILE_SYNC'
    | 'AID_REQUEST'
    | 'UPDATE_FACILITY_STATUS'
    | 'DELETE_FACILITY'
    | 'CREATE_AID_POINT'
    | 'UPDATE_AID_POINT'
    | 'DELETE_AID_POINT'
    | 'UPDATE_AID_STATUS'
  status: 'pending' | 'done' | 'failed'
  payload: Record<string, unknown>
  createdAt: number
  retries?: number
  errorMsg?: string
  updatedAt?: number
}

/** Add a task to the sync queue (executed when internet returns). */
export async function idbEnqueueSync(item: Omit<SyncQueueItem, 'id'>): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite')
      tx.objectStore(STORE_SYNC_QUEUE).add(item)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // sync queue unavailable — silently ignore
  }
}

/** Retrieve all pending sync items. */
export async function idbGetPendingSyncItems(): Promise<SyncQueueItem[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SYNC_QUEUE, 'readonly')
      const req = tx.objectStore(STORE_SYNC_QUEUE).index('status').getAll('pending')
      req.onsuccess = () => resolve((req.result ?? []) as SyncQueueItem[])
      req.onerror = () => reject(req.error)
    })
  } catch {
    return []
  }
}

/** Mark a sync item as done. */
export async function idbMarkSyncDone(id: number): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite')
      const store = tx.objectStore(STORE_SYNC_QUEUE)
      const req = store.get(id)
      req.onsuccess = () => {
        const item = req.result
        if (item) { item.status = 'done'; store.put(item) }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // ignore
  }
}

/** Mark a sync item as failed with an error message. */
export async function idbMarkSyncFailed(id: number, errorMsg: string): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite')
      const store = tx.objectStore(STORE_SYNC_QUEUE)
      const req = store.get(id)
      req.onsuccess = () => {
        const item = req.result
        if (item) { item.status = 'failed'; item.errorMsg = errorMsg; store.put(item) }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // ignore
  }
}

/** Increment the retry counter for a sync item. */
export async function idbIncrementSyncRetry(id: number): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite')
      const store = tx.objectStore(STORE_SYNC_QUEUE)
      const req = store.get(id)
      req.onsuccess = () => {
        const item = req.result
        if (item) { item.retries = (item.retries ?? 0) + 1; store.put(item) }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // ignore
  }
}

/** Get count of pending sync items (for badge display). */
export async function idbGetPendingSyncCount(): Promise<number> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SYNC_QUEUE, 'readonly')
      const req = tx.objectStore(STORE_SYNC_QUEUE).index('status').count(IDBKeyRange.only('pending'))
      req.onsuccess = () => resolve(req.result ?? 0)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return 0
  }
}
