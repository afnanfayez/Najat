import Dexie, { type Table } from 'dexie'
import type { HealthFacility } from '@/schemas/healthFacility'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import type { Article } from '@/schemas/healthGuide'
import type { SafetyMapLayers } from '@/lib/maps/safetyMapTransforms'
import type { AdminHealthFacility, AdminHealthMedicalContent } from '@/schemas/adminHealth'
import type { AdminAidDistributionPoint } from '@/schemas/adminAid'
import type { AdminUserDto } from '@/schemas/adminUser'

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

export interface CachedAdminFacility {
  id: string
  data: AdminHealthFacility
  cachedAt: number
}

export interface CachedAdminAidPoint {
  id: string
  data: AdminAidDistributionPoint
  cachedAt: number
}

export interface CachedAdminUser {
  id: string
  data: AdminUserDto
  cachedAt: number
}

export interface CachedAdminHealthContent {
  id: string
  data: AdminHealthMedicalContent
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
  | 'AID_REQUEST'
  | 'PROFILE_SYNC'
  | 'SESSION_REFRESH'
  | 'CREATE_DANGER_ZONE'
  | 'UPDATE_DANGER_ZONE'
  | 'DELETE_DANGER_ZONE'
  | 'CREATE_SAFE_ROAD'
  | 'DELETE_SAFE_ROAD'
  | 'CREATE_RESOURCE_POINT'
  | 'DELETE_RESOURCE_POINT'

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
// Auth snapshot (replaces raw IDB najat-offline-db → auth-snapshots)
// ──────────────────────────────────────────────────────────────────────────────

export interface AuthSnapshot {
  email: string       // keyPath
  passwordHash: string
  token: string
  role: string
  profile: unknown | null
  savedAt: number     // was _savedAt in the old raw IDB type
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
  authSnapshots!: Table<AuthSnapshot, string>
  adminFacilities!: Table<CachedAdminFacility, string>
  adminAidPoints!: Table<CachedAdminAidPoint, string>
  adminUsers!: Table<CachedAdminUser, string>
  adminHealthContent!: Table<CachedAdminHealthContent, string>

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
    this.version(4).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
      articles: 'id, category, cachedAt',
      offlineSyncQueue: '++id, type, status, createdAt',
      authSnapshots: 'email, savedAt',
    })
    this.version(5).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
      articles: 'id, category, cachedAt',
      offlineSyncQueue: '++id, type, status, createdAt',
      authSnapshots: 'email, savedAt',
      adminFacilities: 'id, cachedAt',
      adminAidPoints: 'id, cachedAt',
    })
    this.version(6).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
      articles: 'id, category, cachedAt',
      offlineSyncQueue: '++id, type, status, createdAt',
      authSnapshots: 'email, savedAt',
      adminFacilities: 'id, cachedAt',
      adminAidPoints: 'id, cachedAt',
      adminUsers: 'id, cachedAt',
    })
    // v7: safety CRUD offline queue types added (no schema change required)
    this.version(7).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
      articles: 'id, category, cachedAt',
      offlineSyncQueue: '++id, type, status, createdAt',
      authSnapshots: 'email, savedAt',
      adminFacilities: 'id, cachedAt',
      adminAidPoints: 'id, cachedAt',
      adminUsers: 'id, cachedAt',
    })
    // v8: admin health medical content cache
    this.version(8).stores({
      facilities: 'id, category, cachedAt',
      facilityDetails: 'id, category, cachedAt',
      aid: 'id, cachedAt',
      safetyMap: 'id',
      localPlaces: 'id, name, type',
      syncMeta: 'key',
      articles: 'id, category, cachedAt',
      offlineSyncQueue: '++id, type, status, createdAt',
      authSnapshots: 'email, savedAt',
      adminFacilities: 'id, cachedAt',
      adminAidPoints: 'id, cachedAt',
      adminUsers: 'id, cachedAt',
      adminHealthContent: 'id, cachedAt',
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
  const rows = facilities.map((f) => ({
    id: f.id,
    category: f.category,
    facility: f,
    cachedAt: now,
    updatedAt: now,
    version: 1,
  }))
  await db.transaction('rw', db.facilities, db.facilityDetails, async () => {
    await db.facilities.bulkPut(rows)
    await db.facilityDetails.bulkPut(
      rows.map(({ version, ...row }) => row),
    )
  })
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

// ──────────────────────────────────────────────────────────────────────────────
// Auth snapshot helpers (replaces lib/pwa/offlineDB.ts raw IDB implementation)
// ──────────────────────────────────────────────────────────────────────────────

export async function putAuthSnapshot(snap: Omit<AuthSnapshot, 'savedAt'>): Promise<void> {
  const db = getOfflineDB()
  await db.authSnapshots.put({ ...snap, savedAt: Date.now() })
}

export async function getAuthSnapshot(email: string): Promise<AuthSnapshot | null> {
  const db = getOfflineDB()
  return (await db.authSnapshots.get(email.trim().toLowerCase())) ?? null
}

export async function getLatestAuthSnapshot(): Promise<AuthSnapshot | null> {
  const db = getOfflineDB()
  const all = await db.authSnapshots.toArray()
  if (all.length === 0) return null
  return all.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))[0]
}

export async function updateAuthProfile(email: string, profile: unknown): Promise<void> {
  const db = getOfflineDB()
  const snap = await db.authSnapshots.get(email.trim().toLowerCase())
  if (!snap) return
  await db.authSnapshots.put({ ...snap, profile, savedAt: Date.now() })
}

export async function deleteAuthSnapshot(email: string): Promise<void> {
  const db = getOfflineDB()
  await db.authSnapshots.delete(email.trim().toLowerCase())
}

// ──────────────────────────────────────────────────────────────────────────────
// Admin facility cache helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function putAdminFacilities(items: AdminHealthFacility[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.adminFacilities.bulkPut(items.map((f) => ({ id: f.id, data: f, cachedAt: now })))
}

export async function getAdminFacilities(): Promise<AdminHealthFacility[]> {
  const db = getOfflineDB()
  const rows = await db.adminFacilities.toArray()
  return rows.map((r) => r.data)
}

export async function getAdminFacilityById(id: string): Promise<AdminHealthFacility | null> {
  const db = getOfflineDB()
  const row = await db.adminFacilities.get(id)
  return row?.data ?? null
}

// ──────────────────────────────────────────────────────────────────────────────
// Admin aid point cache helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function putAdminAidPoints(items: AdminAidDistributionPoint[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.adminAidPoints.bulkPut(items.map((p) => ({ id: p.id, data: p, cachedAt: now })))
}

export async function getAdminAidPoints(): Promise<AdminAidDistributionPoint[]> {
  const db = getOfflineDB()
  const rows = await db.adminAidPoints.toArray()
  return rows.map((r) => r.data)
}

export async function getAdminAidPointById(id: string): Promise<AdminAidDistributionPoint | null> {
  const db = getOfflineDB()
  const row = await db.adminAidPoints.get(id)
  return row?.data ?? null
}

// ──────────────────────────────────────────────────────────────────────────────
// Admin user cache helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function putAdminUsers(users: AdminUserDto[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.adminUsers.bulkPut(users.map((u) => ({ id: u.id, data: u, cachedAt: now })))
}

export async function getAdminUsers(): Promise<AdminUserDto[]> {
  const db = getOfflineDB()
  const rows = await db.adminUsers.toArray()
  return rows.map((r) => r.data)
}

// ──────────────────────────────────────────────────────────────────────────────
// Admin health content cache helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function putAdminHealthContent(items: AdminHealthMedicalContent[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.adminHealthContent.bulkPut(items.map((c) => ({ id: c.id, data: c, cachedAt: now })))
}

export async function getAdminHealthContent(): Promise<AdminHealthMedicalContent[]> {
  const db = getOfflineDB()
  const rows = await db.adminHealthContent.toArray()
  return rows.map((r) => r.data)
}

export async function getAdminHealthContentById(id: string): Promise<AdminHealthMedicalContent | null> {
  const db = getOfflineDB()
  const row = await db.adminHealthContent.get(id)
  return row?.data ?? null
}
