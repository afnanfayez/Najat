import Dexie, { type Table } from 'dexie'
import type { HealthFacility } from '@/schemas/healthFacility'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import type { Article } from '@/schemas/healthGuide'
import type { SafetyMapLayers } from '@/lib/maps/safetyMapTransforms'

// ──────────────────────────────────────────────────────────────────────────────
// Cached entity types
// ──────────────────────────────────────────────────────────────────────────────

export interface CachedFacilityDetail {
  id: string
  category: string
  facility: HealthFacility
  cachedAt: number
  updatedAt?: number
}

export interface CachedAid {
  id: string
  aid: HumanitarianAid
  cachedAt: number
  updatedAt?: number
  version?: number
}

export interface CachedSafetyMap {
  id: 'layers'
  data: SafetyMapLayers
  cachedAt: number
}

export interface LocalPlace {
  id: string
  name: string
  lat: number
  lng: number
  display_name: string
  type: 'hospital' | 'pharmacy' | 'clinic' | 'lab' | 'dental' | 'aid' | 'landmark'
}

export interface SyncMeta {
  key: string
  lastSyncAt: number
  count?: number
}

export interface CachedFacility {
  id: string
  category: string
  facility: HealthFacility
  cachedAt: number
  updatedAt?: number
  version?: number
}

export interface CachedArticle {
  id: string
  category: string
  article: Article
  cachedAt: number
}

// ──────────────────────────────────────────────────────────────────────────────
// Offline Sync Queue (Dexie) — for admin mutations
// ──────────────────────────────────────────────────────────────────────────────

export type OfflineSyncType =
  | 'UPDATE_FACILITY_STATUS'
  | 'DELETE_FACILITY'
  | 'CREATE_AID_POINT'
  | 'UPDATE_AID_POINT'
  | 'DELETE_AID_POINT'
  | 'UPDATE_AID_STATUS'

export type OfflineSyncStatus = 'pending' | 'syncing' | 'done' | 'failed' | 'conflict'

export interface OfflineSyncQueueItem {
  id?: number
  type: OfflineSyncType
  status: OfflineSyncStatus
  payload: Record<string, unknown>
  createdAt: number
  updatedAt: number
  retries: number
  errorMsg?: string
  version?: number
}

// ──────────────────────────────────────────────────────────────────────────────
// Dexie class
// ──────────────────────────────────────────────────────────────────────────────

class NajatOfflineDB extends Dexie {
  facilities!: Table<CachedFacility, string>
  facilityDetails!: Table<CachedFacilityDetail, string>
  aid!: Table<CachedAid, string>
  safetyMap!: Table<CachedSafetyMap, 'layers'>
  localPlaces!: Table<LocalPlace, string>
  syncMeta!: Table<SyncMeta, string>
  articles!: Table<CachedArticle, string>
  offlineSyncQueue!: Table<OfflineSyncQueueItem, number>

  constructor() {
    super('najat-offline-v2')
    this.version(1).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
    })
    this.version(2).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
      articles: 'id, category, cachedAt',
    })
    this.version(3).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
      articles: 'id, category, cachedAt',
      offlineSyncQueue: '++id, type, status, createdAt',
    })
  }
}

let _db: NajatOfflineDB | null = null

export function getOfflineDB(): NajatOfflineDB {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is not available in server context')
  }
  if (!_db) {
    _db = new NajatOfflineDB()
  }
  return _db
}

// ──────────────────────────────────────────────────────────────────────────────
// Facility helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function getFacilitiesByCategory(category: string): Promise<HealthFacility[]> {
  const db = getOfflineDB()
  const rows = await db.facilities.where('category').equals(category).toArray()
  return rows.map((r) => r.facility)
}

export async function getAllFacilities(): Promise<HealthFacility[]> {
  const db = getOfflineDB()
  const rows = await db.facilities.toArray()
  return rows.map((r) => r.facility)
}

export async function getFacilityDetail(id: string): Promise<HealthFacility | null> {
  const db = getOfflineDB()
  const row = await db.facilityDetails.get(id)
  return row?.facility ?? null
}

export async function putFacilities(facilities: HealthFacility[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.facilities.bulkPut(
    facilities.map((f) => ({
      id: f.id,
      category: f.category,
      facility: f,
      cachedAt: now,
      updatedAt: now,
      version: 1,
    }))
  )
}

export async function putFacilityDetail(facility: HealthFacility): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.facilityDetails.put({
    id: facility.id,
    category: facility.category,
    facility,
    cachedAt: now,
    updatedAt: now,
  })
}

// ──────────────────────────────────────────────────────────────────────────────
// Aid helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function getAllAid(): Promise<HumanitarianAid[]> {
  const db = getOfflineDB()
  const rows = await db.aid.toArray()
  return rows.map((r) => r.aid)
}

export async function putAid(items: HumanitarianAid[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.aid.bulkPut(
    items.map((a) => ({ id: a.id, aid: a, cachedAt: now, updatedAt: now, version: 1 }))
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Safety map helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function getSafetyMapLayers(): Promise<SafetyMapLayers | null> {
  const db = getOfflineDB()
  const row = await db.safetyMap.get('layers')
  return row?.data ?? null
}

export async function putSafetyMapLayers(data: SafetyMapLayers): Promise<void> {
  const db = getOfflineDB()
  await db.safetyMap.put({ id: 'layers', data, cachedAt: Date.now() })
}

// ──────────────────────────────────────────────────────────────────────────────
// Local places helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function searchLocalPlaces(query: string): Promise<LocalPlace[]> {
  if (!query.trim()) return []
  const db = getOfflineDB()
  const q = query.trim().toLowerCase()
  const all = await db.localPlaces.toArray()
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.display_name.toLowerCase().includes(q)
  )
}

export async function putLocalPlaces(places: LocalPlace[]): Promise<void> {
  const db = getOfflineDB()
  await db.localPlaces.bulkPut(places)
}

// ──────────────────────────────────────────────────────────────────────────────
// Sync meta helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function getSyncMeta(key: string): Promise<SyncMeta | null> {
  const db = getOfflineDB()
  return (await db.syncMeta.get(key)) ?? null
}

export async function setSyncMeta(key: string, count?: number): Promise<void> {
  const db = getOfflineDB()
  await db.syncMeta.put({ key, lastSyncAt: Date.now(), count })
}

export async function getLastSyncTime(): Promise<number | null> {
  try {
    const db = getOfflineDB()
    const meta = await db.syncMeta.get('all')
    return meta?.lastSyncAt ?? null
  } catch {
    return null
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Article helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  const db = getOfflineDB()
  const rows = await db.articles.toArray()
  return rows.map((r) => r.article)
}

export async function getArticleById(id: string): Promise<Article | null> {
  const db = getOfflineDB()
  const row = await db.articles.get(id)
  return row?.article ?? null
}

export async function putArticles(articles: Article[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.articles.bulkPut(
    articles.map((a) => ({
      id: a.id,
      category: a.category,
      article: a,
      cachedAt: now,
    })),
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Offline Sync Queue helpers (Dexie — for admin mutations)
// ──────────────────────────────────────────────────────────────────────────────

export async function enqueueOfflineOp(
  item: Omit<OfflineSyncQueueItem, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'retries'>
): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.offlineSyncQueue.add({
    ...item,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    retries: 0,
  })
}

export async function getPendingOfflineOps(): Promise<OfflineSyncQueueItem[]> {
  const db = getOfflineDB()
  return db.offlineSyncQueue
    .where('status')
    .anyOf(['pending', 'syncing'])
    .toArray()
}

export async function getPendingOfflineOpsCount(): Promise<number> {
  const db = getOfflineDB()
  return db.offlineSyncQueue
    .where('status')
    .anyOf(['pending', 'syncing', 'failed'])
    .count()
}

export async function markOfflineOpSyncing(id: number): Promise<void> {
  const db = getOfflineDB()
  await db.offlineSyncQueue.update(id, { status: 'syncing', updatedAt: Date.now() })
}

export async function markOfflineOpDone(id: number): Promise<void> {
  const db = getOfflineDB()
  await db.offlineSyncQueue.update(id, { status: 'done', updatedAt: Date.now() })
}

export async function markOfflineOpFailed(id: number, errorMsg: string): Promise<void> {
  const db = getOfflineDB()
  await db.offlineSyncQueue.update(id, {
    status: 'failed',
    errorMsg,
    updatedAt: Date.now(),
  })
}

export async function markOfflineOpConflict(id: number): Promise<void> {
  const db = getOfflineDB()
  await db.offlineSyncQueue.update(id, { status: 'conflict', updatedAt: Date.now() })
}

export async function incrementOfflineOpRetry(id: number): Promise<void> {
  const db = getOfflineDB()
  const item = await db.offlineSyncQueue.get(id)
  if (!item) return
  await db.offlineSyncQueue.update(id, {
    retries: (item.retries ?? 0) + 1,
    updatedAt: Date.now(),
  })
}
