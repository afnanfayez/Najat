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
import { USE_MOCK_HEALTH_FACILITIES } from '@/lib/mocks/healthFacilitiesMockData'

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
    queryFn: () => fetchDetailDto(category, id),
    enabled:
      opts.enabled &&
      !!id &&
      !USE_MOCK_HEALTH_FACILITIES,
    staleTime: 60 * 1000,
  })

  const mergedFacility = useMemo((): HealthFacility | null => {
    if (!facility) return null
    if (!opts.enabled) return facility
    if (!query.data) return facility
    try {
      const mapped = mapDtoToFacility(category, query.data)
      return mergePreferringListProximity(facility, mapped)
    } catch {
      return facility
    }
  }, [facility, query.data, category, opts.enabled])

  return {
    facility: mergedFacility,
    isLoading: query.isFetching,
    error: query.error,
  }
}
