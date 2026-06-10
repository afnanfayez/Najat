import { clinicsAPI } from '@/lib/api/clinics'
import { dentalClinicsAPI } from '@/lib/api/dentalClinics'
import { hospitalsAPI } from '@/lib/api/hospitals'
import { labsAPI } from '@/lib/api/labs'
import { pharmaciesAPI } from '@/lib/api/pharmacies'
import { mapClinicDtoToFacility } from '@/lib/mappers/clinic'
import { mapDentalDtoToFacility } from '@/lib/mappers/dentalClinic'
import { mapHospitalDtoToFacility } from '@/lib/mappers/hospital'
import { mapLabDtoToFacility } from '@/lib/mappers/lab'
import { mapPharmacyDtoToFacility } from '@/lib/mappers/pharmacy'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'
import { getAllFacilities, putFacilityDetail } from './db'

const CONCURRENCY = 2
const MAX_BACKGROUND_DETAILS = 40

async function fetchAndCacheDetail(
  category: FacilityCategory,
  id: string,
): Promise<void> {
  try {
    let facility: HealthFacility
    switch (category) {
      case 'hospitals':
        facility = mapHospitalDtoToFacility(await hospitalsAPI.getById(id))
        break
      case 'pharmacies':
        facility = mapPharmacyDtoToFacility(await pharmaciesAPI.getById(id))
        break
      case 'labs':
        facility = mapLabDtoToFacility(await labsAPI.getById(id))
        break
      case 'clinics':
        facility = mapClinicDtoToFacility(await clinicsAPI.getById(id))
        break
      case 'dental':
        facility = mapDentalDtoToFacility(await dentalClinicsAPI.getById(id))
        break
      default:
        return
    }
    await putFacilityDetail(facility)
  } catch {
    // skip failed detail fetches
  }
}

async function runPool<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0
  async function next(): Promise<void> {
    const i = index++
    if (i >= items.length) return
    await worker(items[i])
    await next()
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => next()),
  )
}

export async function syncAllFacilityDetails(): Promise<void> {
  const facilities = await getAllFacilities()
  const batch = facilities.slice(0, MAX_BACKGROUND_DETAILS)
  await runPool(batch, async (f) => {
    await fetchAndCacheDetail(f.category, f.id)
    await new Promise((r) => setTimeout(r, 50))
  })
}
