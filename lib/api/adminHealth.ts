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

function normalizeMultipartFacilityPayload(
  payload: FormData,
  facilityType?: AdminHealthFacilityType,
): FormData {
  const fd = new FormData()

  payload.forEach((value, key) => {
    fd.append(key, value)
  })

  const status = fd.get('status')
  if (typeof status === 'string') {
    fd.set('status', adminStatusToCapacityStatus(status))
  }

  if (facilityType === 'lab' && !fd.has('availableTests')) {
    fd.set('availableTests', JSON.stringify([{ name: 'فحص عام', type: 'general', resultTime: '24 ساعة' }]))
    fd.set('homeCollection', 'false')
    fd.set('isoCertified', 'false')
  }

  if (facilityType === 'clinic' && !fd.has('specialties')) {
    const categories = fd.get('healthcareCategories')
    fd.set('specialties', typeof categories === 'string' ? categories : JSON.stringify(['طب عام']))
    fd.set('practitionersCount', '1')
  }

  if (facilityType === 'dental_clinic' && !fd.has('availableTests')) {
    fd.set('dentalChairs', '1')
    fd.set('implantsAvailable', 'false')
    fd.set('orthodonticsAvailable', 'false')
    fd.set('availableTests', JSON.stringify([{ name: 'فحص أسنان عام', type: 'general', resultTime: '24 ساعة' }]))
  }

  return fd
}

/** Full PATCH/POST payload — accepted by all facility types */
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

/**
 * Adds the facility-type-specific fields required by the backend's create DTOs.
 * The PATCH endpoints for clinics/dental-clinics/labs reuse those same create DTOs,
 * so updates need these fields too or the backend's validation blows up.
 */
function buildTypedFacilityPayload(
  b: CreateAdminHealthFacilityBody,
  facilityType?: AdminHealthFacilityType,
): Record<string, unknown> {
  const full = buildCreatePayload(b)
  const categories = b.healthcareCategories?.length ? b.healthcareCategories : ['طب عام']

  switch (facilityType) {
    case 'lab':
      return {
        ...full,
        availableTests: [{ name: 'فحص عام', type: 'general', resultTime: '24 ساعة' }],
        homeCollection: false,
        isoCertified: false,
      }
    case 'clinic':
      return {
        ...full,
        specialties: categories,
        practitionersCount: b.workingDoctors?.length ?? 1,
      }
    case 'dental_clinic':
      return {
        ...full,
        dentalChairs: 1,
        implantsAvailable: false,
        orthodonticsAvailable: false,
        availableTests: [{ name: 'فحص أسنان عام', type: 'general', resultTime: '24 ساعة' }],
      }
    default:
      return full
  }
}

export async function createAdminHealthFacilityFromApi(
  body: CreateAdminHealthFacilityBody | FormData,
  facilityType?: AdminHealthFacilityType,
): Promise<AdminHealthFacility> {
  if (body instanceof FormData) {
    const payload = normalizeMultipartFacilityPayload(body, facilityType)
    switch (facilityType) {
      case 'pharmacy':  return mapPharmacy(await pharmaciesAPI.create(payload))
      case 'lab':       return mapLab(await labsAPI.create(payload))
      case 'clinic':    return mapClinic(await clinicsAPI.create(payload))
      case 'dental_clinic': return mapDentalClinic(await dentalClinicsAPI.create(payload))
      default: {
        const created = await hospitalsAPI.create(payload)
        return mapHospital(created)
      }
    }
  }

  const b = body as CreateAdminHealthFacilityBody
  const payload = buildTypedFacilityPayload(b, facilityType)

  switch (facilityType) {
    case 'pharmacy':
      return mapPharmacy(await pharmaciesAPI.create(payload))
    case 'lab':
      return mapLab(await labsAPI.create(payload))
    case 'clinic':
      return mapClinic(await clinicsAPI.create(payload))
    case 'dental_clinic':
      return mapDentalClinic(await dentalClinicsAPI.create(payload))
    default: {
      const created = await hospitalsAPI.create(payload)
      return mapHospital(created)
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
    payload = normalizeMultipartFacilityPayload(body, facilityType)
  } else {
    // Use the full payload (same fields as create) so the backend has all required data
    payload = buildTypedFacilityPayload(body as CreateAdminHealthFacilityBody, facilityType)
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
  let body = article.contentAr || ''
  let references = ''

  const refIndex = body.indexOf('\n\n---REFERENCES---\n')
  if (refIndex !== -1) {
    references = body.slice(refIndex + 19)
    body = body.slice(0, refIndex)
  }

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
    status: article.isActive ? 'published' : 'draft',
    category: article.category,
    description: body.slice(0, 120),
    body: body,
    references: references,
  }
}

function contentBodyToArticle(body: CreateAdminHealthContentBody): CreateArticleBody {
  const wordCount = body.body.trim().split(/\s+/).filter(Boolean).length
  let contentAr = body.body
  if (body.references && body.references.trim()) {
    contentAr += `\n\n---REFERENCES---\n${body.references.trim()}`
  }
  return {
    titleAr: body.title,
    contentAr: contentAr,
    category: body.category,
    ...(body.thumbnailUrl && { image: body.thumbnailUrl }),
    readTime: Math.max(1, Math.ceil(wordCount / 180)),
    isActive: body.status === 'published',
  }
}

function contentUpdateToArticle(body: UpdateAdminHealthContentBody): UpdateArticleBody {
  const result: UpdateArticleBody = {}
  if (body.title !== undefined) result.titleAr = body.title
  if (body.category !== undefined) result.category = body.category
  if (body.thumbnailUrl) result.image = body.thumbnailUrl

  if (body.body !== undefined || body.references !== undefined) {
    let contentAr = body.body ?? ''
    const refs = body.references ?? ''
    if (refs.trim()) {
      contentAr += `\n\n---REFERENCES---\n${refs.trim()}`
    }
    result.contentAr = contentAr

    const wordCount = contentAr.trim().split(/\s+/).filter(Boolean).length
    result.readTime = Math.max(1, Math.ceil(wordCount / 180))
  }

  if (body.status !== undefined) result.isActive = body.status === 'published'
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
  const jsonBody = contentBodyToArticle(body)
  let payload: CreateArticleBody | FormData = jsonBody

  if (body.imageFile) {
    const fd = new FormData()
    fd.append('titleAr', jsonBody.titleAr)
    if (jsonBody.contentAr) fd.append('contentAr', jsonBody.contentAr)
    if (jsonBody.category) fd.append('category', jsonBody.category)
    if (jsonBody.readTime) fd.append('readTime', jsonBody.readTime.toString())
    if (jsonBody.isActive !== undefined) fd.append('isActive', jsonBody.isActive ? 'true' : 'false')
    fd.append('image', body.imageFile)
    payload = fd
  }

  const article = await articlesAPI.create(payload)
  return mapArticleToContent(article)
}

export async function updateAdminHealthContentFromApi(
  id: string,
  body: UpdateAdminHealthContentBody,
): Promise<AdminHealthMedicalContent> {
  const jsonBody = contentUpdateToArticle(body)
  let payload: UpdateArticleBody | FormData = jsonBody

  if (body.imageFile) {
    const fd = new FormData()
    if (jsonBody.titleAr) fd.append('titleAr', jsonBody.titleAr)
    if (jsonBody.contentAr) fd.append('contentAr', jsonBody.contentAr)
    if (jsonBody.category) fd.append('category', jsonBody.category)
    if (jsonBody.readTime) fd.append('readTime', jsonBody.readTime.toString())
    if (jsonBody.isActive !== undefined) fd.append('isActive', jsonBody.isActive ? 'true' : 'false')
    fd.append('image', body.imageFile)
    payload = fd
  }

  const article = await articlesAPI.update(id, payload)
  return mapArticleToContent(article)
}

export async function deleteAdminHealthContentFromApi(id: string): Promise<void> {
  await articlesAPI.softDelete(id)
}
