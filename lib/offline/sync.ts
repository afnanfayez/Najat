import { fetchAllArticlePages } from '@/lib/api/articles'
import { fetchAllAidPages } from '@/lib/health/aidBackend'
import { fetchLiveNonHospitalFacilities } from '@/lib/health/healthFacilitiesBackend'
import { fetchAllHospitalPages } from '@/lib/health/hospitalsBackend'
import { mapArticleDtoToUi } from '@/lib/mappers/article'
import { safetyAPI } from '@/lib/api/safety'
import { getToken } from '@/lib/api/auth'
import {
  precacheAllFacilityMapTiles,
  precacheMainMapArea,
} from '@/lib/pwa/mapTileCache'
import {
  putFacilities,
  putAid,
  putSafetyMapLayers,
  putLocalPlaces,
  putArticles,
  setSyncMeta,
  getOfflineDB,
  getAllFacilities,
  getAllAid,
  getAllArticles,
  getLastSyncTime,
  type LocalPlace,
} from './db'
import type { HealthFacility } from '@/schemas/healthFacility'
import { warmOfflineImages } from './warmImageCache'

const SYNC_COOLDOWN_MS = 30 * 60 * 1000
const HEAVY_SYNC_SESSION_KEY = 'najat-heavy-sync-done'

let isSyncing = false
let isHeavySyncing = false
let syncTimer: ReturnType<typeof setInterval> | null = null

function facilitiesToLocalPlaces(facilities: HealthFacility[], type: LocalPlace['type']): LocalPlace[] {
  return facilities
    .filter((f) => f.latitude != null && f.longitude != null)
    .map((f) => ({
      id: `${type}-${f.id}`,
      name: f.name,
      lat: f.latitude!,
      lng: f.longitude!,
      display_name: `${f.name}، ${f.address}`,
      type,
    }))
}

function scheduleHeavyAssetsSync(): void {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem(HEAVY_SYNC_SESSION_KEY) === '1') return

  const run = () => {
    if (isHeavySyncing || !navigator.onLine) return
    isHeavySyncing = true
    void (async () => {
      try {
        await syncMapTiles()
        await warmCachedImages()
        sessionStorage.setItem(HEAVY_SYNC_SESSION_KEY, '1')
      } finally {
        isHeavySyncing = false
      }
    })()
  }

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run, { timeout: 5 * 60_000 })
  } else {
    setTimeout(run, 5 * 60_000)
  }
}

async function syncHospitals(): Promise<void> {
  try {
    const hospitals = await fetchAllHospitalPages()
    if (hospitals.length > 0) {
      await putFacilities(hospitals)
      const places = facilitiesToLocalPlaces(hospitals, 'hospital')
      await putLocalPlaces(places)
    }
  } catch {
    // fail silently — cached data remains available
  }
}

async function syncPharmacies(): Promise<void> {
  try {
    const { facilities } = await fetchLiveNonHospitalFacilities({ category: 'pharmacies' })
    if (facilities.length > 0) {
      await putFacilities(facilities)
      await putLocalPlaces(facilitiesToLocalPlaces(facilities, 'pharmacy'))
    }
  } catch {
    // fail silently
  }
}

async function syncClinics(): Promise<void> {
  try {
    const { facilities } = await fetchLiveNonHospitalFacilities({ category: 'clinics' })
    if (facilities.length > 0) {
      await putFacilities(facilities)
      await putLocalPlaces(facilitiesToLocalPlaces(facilities, 'clinic'))
    }
  } catch {
    // fail silently
  }
}

async function syncLabs(): Promise<void> {
  try {
    const { facilities } = await fetchLiveNonHospitalFacilities({ category: 'labs' })
    if (facilities.length > 0) {
      await putFacilities(facilities)
      await putLocalPlaces(facilitiesToLocalPlaces(facilities, 'lab'))
    }
  } catch {
    // fail silently
  }
}

async function syncDental(): Promise<void> {
  try {
    const { facilities } = await fetchLiveNonHospitalFacilities({ category: 'dental' })
    if (facilities.length > 0) {
      await putFacilities(facilities)
      await putLocalPlaces(facilitiesToLocalPlaces(facilities, 'dental'))
    }
  } catch {
    // fail silently
  }
}

async function syncAid(): Promise<void> {
  try {
    const aid = await fetchAllAidPages()
    if (aid.length > 0) {
      await putAid(aid)
      const db = getOfflineDB()
      const aidPlaces: LocalPlace[] = aid
        .filter((a) => (a as unknown as { latitude?: number }).latitude != null)
        .map((a) => {
          const anyA = a as unknown as { latitude?: number; longitude?: number }
          return {
            id: `aid-${a.id}`,
            name: a.name,
            lat: anyA.latitude ?? 31.5,
            lng: anyA.longitude ?? 34.47,
            display_name: `${a.name} — ${a.provider}`,
            type: 'aid' as const,
          }
        })
      if (aidPlaces.length > 0) await putLocalPlaces(aidPlaces)
    }
  } catch {
    // fail silently
  }
}

async function syncSafetyMap(): Promise<void> {
  try {
    const token = getToken()
    if (!token) return
    const layers = await safetyAPI.getMapData({ limit: 100 })
    await putSafetyMapLayers(layers)
  } catch {
    // fail silently
  }
}

async function syncArticles(): Promise<void> {
  try {
    const dtos = await fetchAllArticlePages()
    if (dtos.length > 0) {
      const articles = dtos.map(mapArticleDtoToUi)
      await putArticles(articles)
    }
  } catch {
    // fail silently
  }
}

async function syncMapTiles(): Promise<void> {
  try {
    const facilities = await getAllFacilities()
    const aid = await getAllAid()
    await precacheMainMapArea()
    await precacheAllFacilityMapTiles(facilities.slice(0, 25))
    await precacheAllFacilityMapTiles(
      aid.slice(0, 15).map((a) => {
        const anyA = a as unknown as { latitude?: number; longitude?: number }
        return { latitude: anyA.latitude, longitude: anyA.longitude }
      }),
    )
  } catch {
    // fail silently
  }
}

async function warmCachedImages(): Promise<void> {
  try {
    const facilities = await getAllFacilities()
    const aid = await getAllAid()
    const articles = await getAllArticles()
    await warmOfflineImages({
      facilities: facilities.slice(0, 30),
      aid: aid.slice(0, 15),
      articles: articles.slice(0, 20),
    })
  } catch {
    // fail silently
  }
}

export async function syncAllData(force = false): Promise<void> {
  if (isSyncing) return
  if (typeof window === 'undefined') return
  if (!navigator.onLine) return

  if (!force) {
    const lastSync = await getLastSyncTime()
    if (lastSync && Date.now() - lastSync < SYNC_COOLDOWN_MS) {
      return
    }
  }

  isSyncing = true
  try {
    await Promise.allSettled([
      syncHospitals(),
      syncPharmacies(),
      syncClinics(),
      syncLabs(),
      syncDental(),
      syncAid(),
      syncSafetyMap(),
      syncArticles(),
    ])
    await setSyncMeta('all')
    scheduleHeavyAssetsSync()
  } finally {
    isSyncing = false
  }
}

/** Called from maps page — prefetch tiles without blocking API elsewhere. */
export async function syncMapAssetsForOffline(): Promise<void> {
  if (isHeavySyncing || !navigator.onLine) return
  isHeavySyncing = true
  try {
    await syncMapTiles()
  } finally {
    isHeavySyncing = false
  }
}

export function initOfflineSync(): () => void {
  if (typeof window === 'undefined') return () => {}

  const startSync = () => {
    void syncAllData()
  }

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(startSync, { timeout: 2 * 60_000 })
  } else {
    setTimeout(startSync, 2 * 60_000)
  }

  const onOnline = () => syncAllData()
  window.addEventListener('online', onOnline)

  if (!syncTimer) {
    syncTimer = setInterval(() => {
      if (navigator.onLine) syncAllData()
    }, 60 * 60 * 1000)
  }

  return () => {
    window.removeEventListener('online', onOnline)
    if (syncTimer) {
      clearInterval(syncTimer)
      syncTimer = null
    }
  }
}
