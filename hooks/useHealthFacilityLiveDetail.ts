'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import type { ClinicDto } from '@/schemas/clinicApi'
import type { DentalDto } from '@/schemas/dentalApi'
import type { HospitalDto } from '@/schemas/hospitalApi'
import type { LabDto } from '@/schemas/labApi'
import type { PharmacyDto } from '@/schemas/pharmacyApi'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'
import { getFacilityDetail, putFacilityDetail } from '@/lib/offline/db'

function mergePreferringListProximity(
  listItem: HealthFacility,
  enriched: HealthFacility,
): HealthFacility {
  return {
    ...enriched,
    distance: listItem.distance ?? enriched.distance,
    distanceMeters: listItem.distanceMeters ?? enriched.distanceMeters,
    region: listItem.region ?? enriched.region,
    /* Keep list-derived UI flags stable if enrichment omits them */
    medicineAvailability:
      enriched.medicineAvailability ?? listItem.medicineAvailability,
  }
}

async function fetchDetailDto(
  category: FacilityCategory,
  id: string,
): Promise<unknown> {
  switch (category) {
    case 'hospitals':
      return hospitalsAPI.getById(id)
    case 'pharmacies':
      return pharmaciesAPI.getById(id)
    case 'labs':
      return labsAPI.getById(id)
    case 'clinics':
      return clinicsAPI.getById(id)
    case 'dental':
      return dentalClinicsAPI.getById(id)
    default:
      throw new Error(`Unknown category: ${category}`)
  }
}

function mapDtoToFacility(
  category: FacilityCategory,
  dto: unknown,
): HealthFacility {
  switch (category) {
    case 'hospitals':
      return mapHospitalDtoToFacility(dto as HospitalDto)
    case 'pharmacies':
      return mapPharmacyDtoToFacility(dto as PharmacyDto)
    case 'labs':
      return mapLabDtoToFacility(dto as LabDto)
    case 'clinics':
      return mapClinicDtoToFacility(dto as ClinicDto)
    case 'dental':
      return mapDentalDtoToFacility(dto as DentalDto)
    default:
      throw new Error(`Unknown category: ${category}`)
  }
}

/**
 * Loads full facility payloads from GET /v1/.../:id while preserving list-derived distance.
 */
export function useHealthFacilityLiveDetail(
  category: FacilityCategory,
  facility: HealthFacility | null,
  opts: { enabled: boolean },
) {
  const id = facility?.id ?? ''

  const query = useQuery({
    queryKey: ['health-facility-live-detail', category, id],
    queryFn: async (): Promise<HealthFacility> => {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline) {
        const cached = await getFacilityDetail(id)
        if (cached) return cached
        throw new Error('No offline data available')
      }

      try {
        const dto = await fetchDetailDto(category, id)
        const mapped = mapDtoToFacility(category, dto)
        await putFacilityDetail(mapped).catch(() => {})
        return mapped
      } catch (e) {
        const cached = await getFacilityDetail(id)
        if (cached) return cached
        throw e
      }
    },
    enabled: opts.enabled && !!id,
    staleTime: 60 * 1000,
  })

  const mergedFacility = useMemo((): HealthFacility | null => {
    if (!facility) return null
    if (!opts.enabled) return facility
    if (!query.data) return facility
    try {
      return mergePreferringListProximity(facility, query.data)
    } catch {
      return facility
    }
  }, [facility, query.data, opts.enabled])

  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  return {
    facility: mergedFacility,
    isLoading: isOffline && query.isPending ? false : query.isFetching,
    error: isOffline && !query.data ? null : query.error,
  }
}
