export type AdminHealthViewTab = 'facilities' | 'content'

export type AdminHealthRegionFilter = 'all' | 'north' | 'central' | 'south'

export type AdminHealthStatusFilter = 'all' | 'open' | 'closed' | 'maintenance'

export type AdminHealthFacilityRegion = 'north' | 'central' | 'south'

export type AdminHealthFacilityStatus = 'open' | 'closed' | 'maintenance'

export type AdminHealthContentStatus = 'published' | 'review' | 'draft'

export type AdminHealthStatsDto = {
  totalFacilities: number
  activeNow: number
  underMaintenance: number
}

export type AdminHealthFacility = {
  id: string
  name: string
  address: string
  imageUrl: string
  isOpen: boolean
  workloadPercent: number
  phone?: string
  region: AdminHealthFacilityRegion
  status: AdminHealthFacilityStatus
}

export type AdminHealthMedicalContent = {
  id: string
  title: string
  author: string
  date: string
  thumbnailUrl: string
  status: AdminHealthContentStatus
}

export type AdminHealthFacilitiesQueryParams = {
  search?: string
  region?: AdminHealthRegionFilter
  status?: AdminHealthStatusFilter
}

export type AdminHealthFacilitiesListResponse = {
  facilities: AdminHealthFacility[]
  stats: AdminHealthStatsDto
}

export type AdminHealthContentQueryParams = {
  search?: string
  limit?: number
}

export type AdminHealthContentListResponse = {
  items: AdminHealthMedicalContent[]
}

export type UpdateAdminHealthFacilityBody = Partial<CreateAdminHealthFacilityBody>

export type AdminHealthFacilityDrug = {
  name: string
  subtitle: string
  status: 'available' | 'low' | 'unavailable'
}

export type AdminHealthFacilityStaff = {
  name: string
  role: string
  shift: string
}

export type CreateAdminHealthFacilityBody = {
  name: string
  address: string
  phone?: string
  region: AdminHealthFacilityRegion | string
  status: AdminHealthFacilityStatus
  imageUrl?: string
  isOpen?: boolean
  workloadPercent?: number
  services?: string[]
  drugs?: AdminHealthFacilityDrug[]
  staff?: AdminHealthFacilityStaff[]
  workingDays?: number[]
  workingTimes?: string[]
  operatingStatus?: 'efficient' | 'limited' | 'closed'
  latitude?: number
  longitude?: number
}
