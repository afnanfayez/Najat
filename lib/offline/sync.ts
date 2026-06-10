import { fetchAllHospitalPages } from '@/lib/health/hospitalsBackend'
import { fetchLiveNonHospitalFacilities } from '@/lib/health/healthFacilitiesBackend'
import { fetchAllAidPages } from '@/lib/health/aidBackend'
import { safetyAPI } from '@/lib/api/safety'
import { getToken } from '@/lib/api/auth'
import {
  putFacilities,
  putAid,
  putSafetyMapLayers,
  putLocalPlaces,
  setSyncMeta,
  getOfflineDB,
  type LocalPlace,
} from './db'
import type { HealthFacility } from '@/schemas/healthFacility'

let isSyncing = false
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

export async function syncAllData(): Promise<void> {
  if (isSyncing) return
  if (typeof window === 'undefined') return
  if (!navigator.onLine) return

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
    ])
    await setSyncMeta('all')
  } finally {
    isSyncing = false
  }
}

export function initOfflineSync(): () => void {
  if (typeof window === 'undefined') return () => {}

  syncAllData()

  const onOnline = () => syncAllData()
  window.addEventListener('online', onOnline)

  if (!syncTimer) {
    syncTimer = setInterval(() => {
      if (navigator.onLine) syncAllData()
    }, 30 * 60 * 1000)
  }

  return () => {
    window.removeEventListener('online', onOnline)
    if (syncTimer) {
      clearInterval(syncTimer)
      syncTimer = null
    }
  }
}
