import Dexie, { type Table } from 'dexie'
import type { HealthFacility } from '@/schemas/healthFacility'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import type { SafetyMapLayers } from '@/lib/maps/safetyMapTransforms'

export interface CachedFacilityDetail {
  id: string
  category: string
  facility: HealthFacility
  cachedAt: number
}

export interface CachedAid {
  id: string
  aid: HumanitarianAid
  cachedAt: number
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
}

class NajatOfflineDB extends Dexie {
  facilities!: Table<CachedFacility, string>
  facilityDetails!: Table<CachedFacilityDetail, string>
  aid!: Table<CachedAid, string>
  safetyMap!: Table<CachedSafetyMap, 'layers'>
  localPlaces!: Table<LocalPlace, string>
  syncMeta!: Table<SyncMeta, string>

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
    facilities.map((f) => ({ id: f.id, category: f.category, facility: f, cachedAt: now }))
  )
}

export async function putFacilityDetail(facility: HealthFacility): Promise<void> {
  const db = getOfflineDB()
  await db.facilityDetails.put({
    id: facility.id,
    category: facility.category,
    facility,
    cachedAt: Date.now(),
  })
}

export async function getAllAid(): Promise<HumanitarianAid[]> {
  const db = getOfflineDB()
  const rows = await db.aid.toArray()
  return rows.map((r) => r.aid)
}

export async function putAid(items: HumanitarianAid[]): Promise<void> {
  const db = getOfflineDB()
  const now = Date.now()
  await db.aid.bulkPut(
    items.map((a) => ({ id: a.id, aid: a, cachedAt: now }))
  )
}

export async function getSafetyMapLayers(): Promise<SafetyMapLayers | null> {
  const db = getOfflineDB()
  const row = await db.safetyMap.get('layers')
  return row?.data ?? null
}

export async function putSafetyMapLayers(data: SafetyMapLayers): Promise<void> {
  const db = getOfflineDB()
  await db.safetyMap.put({ id: 'layers', data, cachedAt: Date.now() })
}

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
