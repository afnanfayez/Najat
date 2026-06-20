export type AdminHealthViewTab = 'facilities' | 'content'

export type AdminHealthRegionFilter = 'all' | 'north' | 'central' | 'south'

export type AdminHealthStatusFilter = 'all' | 'open' | 'closed' | 'maintenance'

export type AdminHealthFacilityRegion = 'north' | 'central' | 'south'

export type AdminHealthFacilityStatus = 'open' | 'closed' | 'maintenance'

export type AdminHealthContentStatus = 'published' | 'review' | 'draft'

export type AdminHealthContentCategory =
  | 'first-aid'
  | 'awareness'
  | 'mental-health'

export type AdminHealthStatsDto = {
  totalFacilities: number
  activeNow: number
  underMaintenance: number
}

export type AdminHealthFacilityType =
  | 'hospital'
  | 'pharmacy'
  | 'lab'
  | 'clinic'
  | 'dental_clinic'

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
  facilityType?: AdminHealthFacilityType
  latitude?: number
  longitude?: number
  workingDoctors?: Array<{ name: string; specialty: string; workingDays?: string[]; workingHours?: string }>
  currentMedications?: Array<{ name: string; type: string; status: string }>
  workingHours?: string
  workingDays?: string[]
}

export type AdminHealthMedicalContent = {
  id: string
  title: string
  author: string
  date: string
  thumbnailUrl: string
  status: AdminHealthContentStatus
  category: AdminHealthContentCategory
  description: string
  body: string
  references: string
}

export type CreateAdminHealthContentBody = Omit<
  AdminHealthMedicalContent,
  'id' | 'date' | 'author' | 'thumbnailUrl'
> & {
  author?: string
  thumbnailUrl?: string
  imageFile?: any
}

export type UpdateAdminHealthContentBody = Partial<CreateAdminHealthContentBody>

export type AdminHealthFacilityTypeFilter = 'all' | AdminHealthFacilityType

export type AdminHealthFacilitiesQueryParams = {
  search?: string
  region?: AdminHealthRegionFilter
  status?: AdminHealthStatusFilter
  facilityType?: AdminHealthFacilityTypeFilter
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

export type AdminHealthFacilityDoctor = {
  name: string
  specialty: string
  workingDays: string[]
  workingHours: string
}

export type AdminHealthFacilityMedication = {
  name: string
  type: string
  status: string
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
  workingDays?: string[]
  workingTimes?: string[]
  operatingStatus?: 'efficient' | 'limited' | 'closed'
  latitude?: number
  longitude?: number
  workingDoctors?: AdminHealthFacilityDoctor[]
  currentMedications?: AdminHealthFacilityMedication[]
  workingHours?: string
  medicalSupplies?: string[]
  healthcareCategories?: string[]
}
