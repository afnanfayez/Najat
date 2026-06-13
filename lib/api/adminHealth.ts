import { hospitalsAPI } from '@/lib/api/hospitals'
import type { HospitalCapacityStatus } from '@/schemas/hospitalApi'
import { pharmaciesAPI } from '@/lib/api/pharmacies'
import { labsAPI } from '@/lib/api/labs'
import { clinicsAPI } from '@/lib/api/clinics'
import { dentalClinicsAPI } from '@/lib/api/dentalClinics'
import { articlesAPI, type CreateArticleBody, type UpdateArticleBody } from '@/lib/api/articles'
import type { HospitalDto } from '@/schemas/hospitalApi'
import type { PharmacyDto } from '@/schemas/pharmacyApi'
import type { LabDto } from '@/schemas/labApi'
import type { ClinicDto } from '@/schemas/clinicApi'
import type { DentalDto } from '@/schemas/dentalApi'
import type { ArticleResponseDto } from '@/schemas/articleApi'
import type {
  AdminHealthContentListResponse,
  AdminHealthFacilitiesListResponse,
  AdminHealthFacilitiesQueryParams,
  AdminHealthContentQueryParams,
  AdminHealthFacility,
  AdminHealthFacilityType,
  AdminHealthMedicalContent,
  AdminHealthStatsDto,
  CreateAdminHealthFacilityBody,
  CreateAdminHealthContentBody,
  UpdateAdminHealthFacilityBody,
  UpdateAdminHealthContentBody,
} from '@/schemas/adminHealth'

const HOSPITAL_STATUS_MAP: Record<string, AdminHealthFacility['status']> = {
  full: 'open',
  available: 'open',
  critical: 'open',
  closed: 'closed',
}

/** Derive a workload percentage from backend capacity status */
function capacityToWorkload(status?: string): number {
  switch (status) {
    case 'full':      return 100
    case 'critical':  return 75
    case 'available': return 50
    default:          return 0
  }
}

// Derive Gaza Strip region from latitude (no region field in backend)
// north ≥ 31.40 | central ≥ 31.20 | south < 31.20
export function latToRegion(lat: number): AdminHealthFacility['region'] {
  if (lat >= 31.40) return 'north'
  if (lat >= 31.20) return 'central'
  return 'south'
}

function mapHospital(h: HospitalDto): AdminHealthFacility {
  return {
    id: h.id,
    name: h.name,
    address: h.address,
    imageUrl: h.image ?? '/assets/health1.jpg',
    isOpen: h.status !== 'closed',
    workloadPercent: capacityToWorkload(h.status),
    phone: h.contactNumber ?? undefined,
    region: latToRegion(h.latitude),
    status: HOSPITAL_STATUS_MAP[h.status] ?? 'open',
    facilityType: 'hospital',
    latitude: h.latitude,
    longitude: h.longitude,
    workingDoctors: h.workingDoctors,
    currentMedications: h.currentMedications as Array<{ name: string; type: string; status: string }> | undefined,
    workingHours: h.workingHours ?? undefined,
    workingDays: h.workingDays,
  }
}

function mapPharmacy(p: PharmacyDto): AdminHealthFacility {
  const status = HOSPITAL_STATUS_MAP[p.status ?? ''] ?? 'open'
  return {
    id: p.id,
    name: p.name,
    address: p.address,
    imageUrl: p.image ?? '/assets/health1.jpg',
    isOpen: status !== 'closed',
    workloadPercent: capacityToWorkload(p.status),
    phone: p.contactNumber ?? undefined,
    region: latToRegion(p.latitude),
    status,
    facilityType: 'pharmacy',
    latitude: p.latitude,
    longitude: p.longitude,
  }
}

function mapLab(l: LabDto): AdminHealthFacility {
  const status = HOSPITAL_STATUS_MAP[l.status ?? ''] ?? 'open'
  return {
    id: l.id,
    name: l.name,
    address: l.address,
    imageUrl: l.image ?? '/assets/health1.jpg',
    isOpen: status !== 'closed',
    workloadPercent: capacityToWorkload(l.status),
    phone: l.contactNumber ?? undefined,
    region: latToRegion(l.latitude),
    status,
    facilityType: 'lab',
    latitude: l.latitude,
    longitude: l.longitude,
  }
}

function mapClinic(c: ClinicDto): AdminHealthFacility {
  const status = HOSPITAL_STATUS_MAP[c.status ?? ''] ?? 'open'
  return {
    id: c.id,
    name: c.name,
    address: c.address,
    imageUrl: c.image ?? '/assets/health1.jpg',
    isOpen: status !== 'closed',
    workloadPercent: capacityToWorkload(c.status),
    phone: c.contactNumber ?? undefined,
    region: latToRegion(c.latitude),
    status,
    facilityType: 'clinic',
    latitude: c.latitude,
    longitude: c.longitude,
  }
}

function mapDentalClinic(d: DentalDto): AdminHealthFacility {
  const status = HOSPITAL_STATUS_MAP[d.status ?? ''] ?? 'open'
  return {
    id: d.id,
    name: d.name,
    address: d.address,
    imageUrl: d.image ?? '/assets/health1.jpg',
    isOpen: status !== 'closed',
    workloadPercent: capacityToWorkload(d.status),
    phone: d.contactNumber ?? undefined,
    region: latToRegion(d.latitude),
    status,
    facilityType: 'dental_clinic',
    latitude: d.latitude,
    longitude: d.longitude,
  }
}

function filterFacilities(
  facilities: AdminHealthFacility[],
  params: AdminHealthFacilitiesQueryParams,
): AdminHealthFacility[] {
  return facilities.filter((f) => {
    if (params.region && params.region !== 'all' && f.region !== params.region) return false
    if (params.status && params.status !== 'all' && f.status !== params.status) return false
    if (params.facilityType && params.facilityType !== 'all' && f.facilityType !== params.facilityType) return false
    if (params.search) {
      const q = params.search.toLowerCase()
      if (!f.name.toLowerCase().includes(q) && !f.address.toLowerCase().includes(q)) return false
    }
    return true
  })
}

function computeStats(facilities: AdminHealthFacility[]): AdminHealthStatsDto {
  return {
    totalFacilities: facilities.length,
    activeNow: facilities.filter((f) => f.status === 'open').length,
    underMaintenance: facilities.filter((f) => f.status === 'maintenance').length,
  }
}

// ─── Facility API routing by type ────────────────────────────────────────────

type FacilityApi = {
  softDelete: (id: string) => Promise<unknown>
  update: (id: string, body: Record<string, unknown> | FormData) => Promise<unknown>
}

function getFacilityApiByType(type?: AdminHealthFacilityType): FacilityApi {
  switch (type) {
    case 'pharmacy':    return pharmaciesAPI
    case 'lab':         return labsAPI
    case 'clinic':      return clinicsAPI
    case 'dental_clinic': return dentalClinicsAPI
    default:            return hospitalsAPI
  }
}

// ─── Health Facilities (from 5 real endpoints) ───────────────────────────────

export async function fetchAdminHealthFacilitiesFromApi(
  params: AdminHealthFacilitiesQueryParams = {},
): Promise<AdminHealthFacilitiesListResponse> {
  const [hospitals, pharmacies, labs, clinics, dentalClinics] = await Promise.allSettled([
    hospitalsAPI.list({ limit: 100 }),
    pharmaciesAPI.list({ limit: 100 }),
    labsAPI.list({ limit: 100 }),
    clinicsAPI.list({ limit: 100 }),
    dentalClinicsAPI.list({ limit: 100 }),
  ])

  const allFacilities: AdminHealthFacility[] = [
    ...(hospitals.status === 'fulfilled' ? hospitals.value.data.map(mapHospital) : []),
    ...(pharmacies.status === 'fulfilled' ? pharmacies.value.data.map(mapPharmacy) : []),
    ...(labs.status === 'fulfilled' ? labs.value.data.map(mapLab) : []),
    ...(clinics.status === 'fulfilled' ? clinics.value.data.map(mapClinic) : []),
    ...(dentalClinics.status === 'fulfilled' ? dentalClinics.value.data.map(mapDentalClinic) : []),
  ]

  const filtered = filterFacilities(allFacilities, params)

  return {
    facilities: filtered,
    stats: computeStats(allFacilities),
  }
}

export async function fetchAdminHealthFacilityByIdFromApi(
  id: string,
  facilityType?: AdminHealthFacilityType,
): Promise<AdminHealthFacility> {
  // Without facilityType we have to try each endpoint — hospitals first (most common)
  if (!facilityType || facilityType === 'hospital') {
    const h = await hospitalsAPI.getById(id)
    return mapHospital(h)
  }
  if (facilityType === 'pharmacy') {
    const p = await pharmaciesAPI.getById(id)
    return mapPharmacy(p)
  }
  if (facilityType === 'lab') {
    const l = await labsAPI.getById(id)
    return mapLab(l)
  }
  if (facilityType === 'clinic') {
    const c = await clinicsAPI.getById(id)
    return mapClinic(c)
  }
  const d = await dentalClinicsAPI.getById(id)
  return mapDentalClinic(d)
}

/** Maps our internal admin status to the hospital API's capacity status enum */
function adminStatusToCapacityStatus(status?: string): string {
  switch (status) {
    case 'open':        return 'available'
    case 'maintenance': return 'critical'
    case 'closed':      return 'closed'
    default:            return 'available'
  }
}

/** Full PATCH payload — accepted by all facility types for updates */
function buildCreatePayload(b: CreateAdminHealthFacilityBody): Record<string, unknown> {
  return {
    name: b.name,
    address: b.address,
    ...(b.phone && { contactNumber: b.phone }),
    ...(b.imageUrl?.startsWith('http') && { image: b.imageUrl }),
    ...(b.latitude != null && { latitude: b.latitude }),
    ...(b.longitude != null && { longitude: b.longitude }),
    status: adminStatusToCapacityStatus(b.status),
    workingDoctors: b.workingDoctors ?? [],
    currentMedications: b.currentMedications ?? [],
    workingHours: b.workingHours ?? 'على مدار 24 ساعة',
    workingDays: b.workingDays ?? [],
    medicalSupplies: b.medicalSupplies ?? [],
    healthcareCategories: b.healthcareCategories ?? [],
  }
}

/** Basic fields only — hospital POST accepts ONLY these, not status/workingDoctors */
function buildHospitalCreatePayload(b: CreateAdminHealthFacilityBody): Record<string, unknown> {
  return {
    name: b.name,
    address: b.address,
    ...(b.latitude != null && { latitude: b.latitude }),
    ...(b.longitude != null && { longitude: b.longitude }),
    ...(b.phone && { contactNumber: b.phone }),
    ...(b.imageUrl?.startsWith('http') && { image: b.imageUrl }),
  }
}

/** Operational fields — sent via PATCH after hospital creation */
function buildOperationalPayload(b: CreateAdminHealthFacilityBody): Record<string, unknown> {
  return {
    status: adminStatusToCapacityStatus(b.status),
    workingDoctors: b.workingDoctors ?? [],
    currentMedications: b.currentMedications ?? [],
    workingHours: b.workingHours ?? 'على مدار 24 ساعة',
    workingDays: b.workingDays ?? [],
    medicalSupplies: b.medicalSupplies ?? [],
    healthcareCategories: b.healthcareCategories ?? [],
  }
}

export async function createAdminHealthFacilityFromApi(
  body: CreateAdminHealthFacilityBody | FormData,
  facilityType?: AdminHealthFacilityType,
): Promise<AdminHealthFacility> {
  if (body instanceof FormData) {
    switch (facilityType) {
      case 'pharmacy':  return mapPharmacy(await pharmaciesAPI.create(body))
      case 'lab':       return mapLab(await labsAPI.create(body))
      case 'clinic':    return mapClinic(await clinicsAPI.create(body))
      case 'dental_clinic': return mapDentalClinic(await dentalClinicsAPI.create(body))
      default:          return mapHospital(await hospitalsAPI.create(body))
    }
  }

  const b = body as CreateAdminHealthFacilityBody
  // Non-hospital types accept workingDoctors/status etc. directly in CREATE
  const full = buildCreatePayload(b)
  const categories = b.healthcareCategories?.length ? b.healthcareCategories : ['طب عام']

  switch (facilityType) {
    case 'pharmacy':
      return mapPharmacy(await pharmaciesAPI.create(full))
    case 'lab':
      return mapLab(await labsAPI.create({
        ...full,
        availableTests: [{ name: 'فحص عام', type: 'general', resultTime: '24 ساعة' }],
        homeCollection: false,
        isoCertified: false,
      }))
    case 'clinic':
      return mapClinic(await clinicsAPI.create({
        ...full,
        specialties: categories,
        practitionersCount: b.workingDoctors?.length ?? 1,
      }))
    case 'dental_clinic':
      return mapDentalClinic(await dentalClinicsAPI.create({
        ...full,
        dentalChairs: 1,
        implantsAvailable: false,
        orthodonticsAvailable: false,
        availableTests: [{ name: 'فحص أسنان عام', type: 'general', resultTime: '24 ساعة' }],
      }))
    default: {
      // Hospital POST only accepts basic fields — send operational data via PATCH afterwards
      const created = await hospitalsAPI.create(buildHospitalCreatePayload(b))
      try {
        const updated = await hospitalsAPI.update(created.id, buildOperationalPayload(b))
        return mapHospital(updated)
      } catch {
        return mapHospital(created)
      }
    }
  }
}

export async function updateAdminHealthFacilityFromApi(
  id: string,
  body: UpdateAdminHealthFacilityBody | FormData,
  facilityType?: AdminHealthFacilityType,
): Promise<AdminHealthFacility> {
  const api = getFacilityApiByType(facilityType)
  let payload: Record<string, unknown> | FormData

  if (body instanceof FormData) {
    payload = body
  } else {
    // Use the full payload (same fields as create) so the backend has all required data
    payload = buildCreatePayload(body as CreateAdminHealthFacilityBody)
  }

  await api.update(id, payload as Record<string, unknown>)
  return fetchAdminHealthFacilityByIdFromApi(id, facilityType)
}

export async function deleteAdminHealthFacilityFromApi(
  id: string,
  facilityType?: AdminHealthFacilityType,
): Promise<void> {
  await getFacilityApiByType(facilityType).softDelete(id)
}

/**
 * Updates only the capacity/operational status of a hospital using the dedicated
 * PATCH /v1/hospitals/{id}/status endpoint (faster, atomic update).
 */
export async function updateAdminHospitalStatusFromApi(
  id: string,
  status: AdminHealthFacility['status'],
): Promise<AdminHealthFacility> {
  const capacityStatus = adminStatusToCapacityStatus(status) as HospitalCapacityStatus
  // HospitalEntity extends HospitalDto — mapHospital accepts both shapes
  const updated = await hospitalsAPI.updateStatus(id, { status: capacityStatus })
  return mapHospital({ ...updated })
}

// ─── Health Content (from /v1/articles) ──────────────────────────────────────

function mapArticleToContent(article: ArticleResponseDto): AdminHealthMedicalContent {
  return {
    id: article.id,
    title: article.titleAr,
    author: article.author?.fullName ?? 'مسؤول نجاة',
    date: new Date(article.createdAt).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    thumbnailUrl: article.image ?? '/assets/artical.png',
    status: 'published',
    category: article.category,
    description: '', // not in ArticleResponseDto
    body: article.contentAr,
    references: '', // not in ArticleResponseDto
  }
}

function contentBodyToArticle(body: CreateAdminHealthContentBody): CreateArticleBody {
  return {
    titleAr: body.title,
    contentAr: body.body,
    category: body.category,
    image: body.thumbnailUrl ?? null,
  }
}

function contentUpdateToArticle(body: UpdateAdminHealthContentBody): UpdateArticleBody {
  const result: UpdateArticleBody = {}
  if (body.title !== undefined) result.titleAr = body.title
  if (body.body !== undefined) result.contentAr = body.body
  if (body.category !== undefined) result.category = body.category
  if (body.thumbnailUrl !== undefined) result.image = body.thumbnailUrl ?? null
  return result
}

export async function fetchAdminHealthContentFromApi(
  params: AdminHealthContentQueryParams = {},
): Promise<AdminHealthContentListResponse> {
  const response = await articlesAPI.list({ limit: params.limit ?? 50 })
  let items = response.data.map(mapArticleToContent)

  if (params.search) {
    const q = params.search.toLowerCase()
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q),
    )
  }

  return { items }
}

export async function fetchAdminHealthContentByIdFromApi(
  id: string,
): Promise<AdminHealthMedicalContent> {
  const article = await articlesAPI.getById(id)
  return mapArticleToContent(article)
}

export async function createAdminHealthContentFromApi(
  body: CreateAdminHealthContentBody,
): Promise<AdminHealthMedicalContent> {
  const article = await articlesAPI.create(contentBodyToArticle(body))
  return mapArticleToContent(article)
}

export async function updateAdminHealthContentFromApi(
  id: string,
  body: UpdateAdminHealthContentBody,
): Promise<AdminHealthMedicalContent> {
  const article = await articlesAPI.update(id, contentUpdateToArticle(body))
  return mapArticleToContent(article)
}

export async function deleteAdminHealthContentFromApi(id: string): Promise<void> {
  await articlesAPI.softDelete(id)
}
