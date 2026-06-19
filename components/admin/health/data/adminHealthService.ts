import {
  createAdminHealthFacilityFromApi,
  createAdminHealthContentFromApi,
  deleteAdminHealthFacilityFromApi,
  deleteAdminHealthContentFromApi,
  fetchAdminHealthContentFromApi,
  fetchAdminHealthContentByIdFromApi,
  fetchAdminHealthFacilitiesFromApi,
  fetchAdminHealthFacilityByIdFromApi,
  updateAdminHealthFacilityFromApi,
  updateAdminHealthContentFromApi,
  updateAdminHospitalStatusFromApi,
} from '@/lib/api/adminHealth'
import {
  getAdminFacilities,
  getAdminFacilityById,
  putAdminFacilities,
  getAdminHealthContent,
  getAdminHealthContentById,
  putAdminHealthContent,
  enqueueOfflineOp,
  getOfflineDB,
} from '@/lib/offline/db'
import { USE_MOCK_ADMIN_HEALTH } from '@/lib/mocks/mockConfig'
import {
  ADMIN_HEALTH_FACILITIES,
  ADMIN_HEALTH_MEDICAL_CONTENT,
  ADMIN_HEALTH_STATS,
} from '@/lib/mocks/adminHealthMockData'
import type {
  AdminHealthContentListResponse,
  AdminHealthContentQueryParams,
  AdminHealthFacilitiesListResponse,
  AdminHealthFacilitiesQueryParams,
  AdminHealthFacility,
  AdminHealthFacilityType,
  AdminHealthMedicalContent,
  AdminHealthRegionFilter,
  AdminHealthStatusFilter,
  CreateAdminHealthFacilityBody,
  CreateAdminHealthContentBody,
} from '@/schemas/adminHealth'
import {
  buildFacilityFormData,
  mapFacilityFormToCreateBody,
  mapFacilityToSetupForm,
} from './facilitySetupMapper'
import {
  mapContentFormToBody,
  mapContentToForm,
} from './medicalContentMapper'
import type { FacilitySetupForm } from '../setup/types'
import type { MedicalContentForm } from '../content/types'

export type {
  AdminHealthFacilitiesQueryParams,
  AdminHealthContentQueryParams,
  AdminHealthFacilitiesListResponse,
  AdminHealthContentListResponse,
}

let mockFacilitiesStore: AdminHealthFacility[] | null = null
let mockFacilityFormsStore: Record<string, FacilitySetupForm> = {}
let mockContentStore: AdminHealthMedicalContent[] | null = null

function getMockContent(): AdminHealthMedicalContent[] {
  if (!mockContentStore) {
    mockContentStore = [...ADMIN_HEALTH_MEDICAL_CONTENT]
  }
  return mockContentStore
}

function getMockFacilities(): AdminHealthFacility[] {
  if (!mockFacilitiesStore) {
    mockFacilitiesStore = [...ADMIN_HEALTH_FACILITIES]
    mockFacilitiesStore.forEach((facility) => {
      if (!mockFacilityFormsStore[facility.id]) {
        mockFacilityFormsStore[facility.id] = mapFacilityToSetupForm(facility)
      }
    })
  }
  return mockFacilitiesStore
}

function computeMockStats(facilities: AdminHealthFacility[]): typeof ADMIN_HEALTH_STATS {
  return {
    totalFacilities: facilities.length,
    activeNow: facilities.filter((f) => f.status === 'open' && f.isOpen).length,
    underMaintenance: facilities.filter((f) => f.status === 'maintenance').length,
  }
}

function bodyToFacilityFields(
  body: CreateAdminHealthFacilityBody,
): Pick<
  AdminHealthFacility,
  'name' | 'address' | 'imageUrl' | 'isOpen' | 'phone' | 'region' | 'status'
> {
  return {
    name: body.name,
    address: body.address,
    imageUrl: body.imageUrl ?? '/assets/health1.jpg',
    isOpen: body.isOpen ?? body.status === 'open',
    phone: body.phone,
    region:
      body.region === 'north' || body.region === 'central' || body.region === 'south'
        ? body.region
        : 'central',
    status: body.status,
  }
}

function createMockFacility(
  body: CreateAdminHealthFacilityBody,
  form: FacilitySetupForm,
): AdminHealthFacility {
  const facilities = getMockFacilities()
  const facility: AdminHealthFacility = {
    id: `mock-${Date.now()}`,
    workloadPercent: body.workloadPercent ?? 0,
    ...bodyToFacilityFields(body),
  }
  mockFacilitiesStore = [facility, ...facilities]
  mockFacilityFormsStore[facility.id] = form
  return facility
}

function updateMockFacility(
  id: string,
  body: CreateAdminHealthFacilityBody,
  form: FacilitySetupForm,
): AdminHealthFacility {
  const facilities = getMockFacilities()
  const index = facilities.findIndex((f) => f.id === id)
  if (index === -1) throw new Error('Facility not found')

  const updated: AdminHealthFacility = {
    ...facilities[index],
    ...bodyToFacilityFields(body),
  }
  mockFacilitiesStore = facilities.map((f, i) => (i === index ? updated : f))
  mockFacilityFormsStore[id] = form
  return updated
}

function deleteMockFacility(id: string): void {
  mockFacilitiesStore = getMockFacilities().filter((f) => f.id !== id)
  delete mockFacilityFormsStore[id]
}

function fetchMockFacilityById(id: string): FacilitySetupForm | null {
  const facility = getMockFacilities().find((f) => f.id === id)
  if (!facility) return null
  return mapFacilityToSetupForm(facility, mockFacilityFormsStore[id])
}

function normalizeSearch(value?: string) {
  return value?.trim().toLowerCase() ?? ''
}

function filterMockFacilities(
  params: AdminHealthFacilitiesQueryParams,
): AdminHealthFacilitiesListResponse {
  const q = normalizeSearch(params.search)
  const region = params.region ?? 'all'
  const status = params.status ?? 'all'
  const facilityType = params.facilityType ?? 'all'

  const facilities = getMockFacilities().filter((facility) => {
    if (region !== 'all' && facility.region !== region) return false
    if (status !== 'all' && facility.status !== status) return false
    if (facilityType !== 'all' && facility.facilityType !== facilityType) return false
    if (!q) return true
    return (
      facility.name.toLowerCase().includes(q) ||
      facility.address.toLowerCase().includes(q)
    )
  })

  return { facilities, stats: computeMockStats(facilities) }
}

function filterCachedFacilities(
  params: AdminHealthFacilitiesQueryParams,
  facilities: AdminHealthFacility[],
): AdminHealthFacilitiesListResponse {
  const q = normalizeSearch(params.search)
  const region = params.region ?? 'all'
  const status = params.status ?? 'all'
  const facilityType = params.facilityType ?? 'all'

  const filtered = facilities.filter((facility) => {
    if (region !== 'all' && facility.region !== region) return false
    if (status !== 'all' && facility.status !== status) return false
    if (facilityType !== 'all' && facility.facilityType !== facilityType) return false
    if (!q) return true
    return (
      facility.name.toLowerCase().includes(q) ||
      facility.address.toLowerCase().includes(q)
    )
  })

  return { facilities: filtered, stats: computeMockStats(filtered) }
}

function filterMockContent(
  params: AdminHealthContentQueryParams,
): AdminHealthContentListResponse {
  const q = normalizeSearch(params.search)
  let items = getMockContent()

  if (q) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q),
    )
  }

  if (params.limit && params.limit > 0) {
    items = items.slice(0, params.limit)
  }

  return { items }
}

function fetchMockContentById(id: string): AdminHealthMedicalContent | null {
  return getMockContent().find((item) => item.id === id) ?? null
}

function createMockContent(body: CreateAdminHealthContentBody): AdminHealthMedicalContent {
  const item: AdminHealthMedicalContent = {
    id: `content-${Date.now()}`,
    author: body.author ?? 'مسؤول نجاة',
    date: new Date().toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    title: body.title,
    category: body.category,
    body: body.body,
    references: body.references ?? '',
    description: body.description,
    status: body.status ?? 'draft',
    thumbnailUrl: body.thumbnailUrl ?? '/assets/artical.png',
  }
  mockContentStore = [item, ...getMockContent()]
  return item
}

function updateMockContent(
  id: string,
  body: CreateAdminHealthContentBody,
): AdminHealthMedicalContent {
  const items = getMockContent()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Content not found')

  const updated: AdminHealthMedicalContent = {
    ...items[index],
    ...body,
    references: body.references ?? items[index].references,
  }
  mockContentStore = items.map((item, i) => (i === index ? updated : item))
  return updated
}

function deleteMockContent(id: string): void {
  mockContentStore = getMockContent().filter((item) => item.id !== id)
}

export async function fetchAdminHealthFacilities(
  params: AdminHealthFacilitiesQueryParams = {},
): Promise<AdminHealthFacilitiesListResponse> {
  if (USE_MOCK_ADMIN_HEALTH) return filterMockFacilities(params)

  try {
    const result = await fetchAdminHealthFacilitiesFromApi(params)
    putAdminFacilities(result.facilities).catch(() => {})
    return result
  } catch {
    const cached = await getAdminFacilities()
    return filterCachedFacilities(params, cached)
  }
}

export async function fetchAdminHealthMedicalContent(
  params: AdminHealthContentQueryParams = {},
): Promise<AdminHealthContentListResponse> {
  if (USE_MOCK_ADMIN_HEALTH) {
    return filterMockContent(params)
  }

  try {
    const result = await fetchAdminHealthContentFromApi(params)
    putAdminHealthContent(result.items).catch(() => {})
    return result
  } catch {
    const cached = await getAdminHealthContent()
    const search = params.search?.toLowerCase() ?? ''
    const items = search
      ? cached.filter(
          (c) =>
            c.title.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search),
        )
      : cached
    return { items }
  }
}

export async function fetchAdminHealthLatestContent(
  limit = 3,
): Promise<AdminHealthMedicalContent[]> {
  if (USE_MOCK_ADMIN_HEALTH) {
    return filterMockContent({ limit }).items
  }

  try {
    const result = await fetchAdminHealthContentFromApi({ limit })
    putAdminHealthContent(result.items).catch(() => {})
    return result.items
  } catch {
    const cached = await getAdminHealthContent()
    return cached.slice(0, limit)
  }
}

export type AdminHealthFilterState = {
  search: string
  region: AdminHealthRegionFilter
  status: AdminHealthStatusFilter
  facilityType?: import('@/schemas/adminHealth').AdminHealthFacilityTypeFilter
}

export function toFacilitiesQueryParams(
  filters: AdminHealthFilterState,
): AdminHealthFacilitiesQueryParams {
  return {
    search: filters.search.trim() || undefined,
    region: filters.region,
    status: filters.status,
    facilityType: filters.facilityType,
  }
}

export function toContentQueryParams(search: string): AdminHealthContentQueryParams {
  return {
    search: search.trim() || undefined,
  }
}

export async function createAdminHealthFacility(
  form: FacilitySetupForm,
  facilityType?: AdminHealthFacilityType,
): Promise<AdminHealthFacility> {
  const hasImages = form.images.some((img) => img.file)
  const body = mapFacilityFormToCreateBody(form)

  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 500))
    return createMockFacility(body, form)
  }

  // Offline: optimistically cache with a temp ID, queue for later sync
  if (typeof window !== 'undefined' && !navigator.onLine) {
    const tempId = `offline-${Date.now()}`
    const optimistic: AdminHealthFacility = {
      id: tempId,
      ...bodyToFacilityFields(body),
      workloadPercent: 0,
      facilityType: facilityType ?? 'hospital',
      latitude: body.latitude,
      longitude: body.longitude,
    }
    await putAdminFacilities([optimistic])
    await enqueueOfflineOp({
      type: 'CREATE_FACILITY_TYPED',
      payload: { body, facilityType, tempId },
    })
    mockFacilityFormsStore[tempId] = form
    return optimistic
  }

  const payload = hasImages ? buildFacilityFormData(form) : body
  const facility = await createAdminHealthFacilityFromApi(payload, facilityType)
  await putAdminFacilities([facility]).catch(() => {})
  mockFacilityFormsStore[facility.id] = form
  return facility
}

export async function fetchAdminHealthFacilityById(
  id: string,
  facilityType?: AdminHealthFacilityType,
): Promise<FacilitySetupForm> {
  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 300))
    const form = fetchMockFacilityById(id)
    if (!form) throw new Error('Facility not found')
    return form
  }

  try {
    const facility = await fetchAdminHealthFacilityByIdFromApi(id, facilityType)
    putAdminFacilities([facility]).catch(() => {})
    return mapFacilityToSetupForm(facility, mockFacilityFormsStore[id])
  } catch {
    const facility = await getAdminFacilityById(id)
    if (facility) return mapFacilityToSetupForm(facility)
    throw new Error('المرفق غير متوفر في وضع عدم الاتصال')
  }
}

export async function updateAdminHealthFacility(
  id: string,
  form: FacilitySetupForm,
  facilityType?: AdminHealthFacilityType,
): Promise<AdminHealthFacility> {
  const hasImages = form.images.some((img) => img.file)
  const body = mapFacilityFormToCreateBody(form)

  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 500))
    return updateMockFacility(id, body, form)
  }

  // Offline: optimistically update cache, queue for later sync
  if (typeof window !== 'undefined' && !navigator.onLine) {
    const existing = await getAdminFacilityById(id)
    const optimistic: AdminHealthFacility = {
      ...(existing ?? { id, workloadPercent: 0, facilityType }),
      ...bodyToFacilityFields(body),
      id,
      facilityType: facilityType ?? existing?.facilityType ?? 'hospital',
      latitude: body.latitude ?? existing?.latitude,
      longitude: body.longitude ?? existing?.longitude,
    }
    await putAdminFacilities([optimistic])
    await enqueueOfflineOp({
      type: 'UPDATE_FACILITY_TYPED',
      payload: { id, body, facilityType },
    })
    mockFacilityFormsStore[id] = form
    return optimistic
  }

  const payload = hasImages ? buildFacilityFormData(form) : body
  const facility = await updateAdminHealthFacilityFromApi(id, payload, facilityType)
  await putAdminFacilities([facility]).catch(() => {})
  mockFacilityFormsStore[id] = form
  return facility
}

export async function updateAdminHospitalStatus(
  id: string,
  status: AdminHealthFacility['status'],
): Promise<AdminHealthFacility> {
  if (USE_MOCK_ADMIN_HEALTH) {
    const facilities = getMockFacilities()
    const index = facilities.findIndex((f) => f.id === id)
    if (index === -1) throw new Error('Facility not found')
    const updated = { ...facilities[index], status, isOpen: status !== 'closed' }
    mockFacilitiesStore = facilities.map((f, i) => (i === index ? updated : f))
    return updated
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    const existing = await getAdminFacilityById(id)
    if (!existing) throw new Error('المنشأة غير متوفرة في وضع عدم الاتصال')
    const optimistic: AdminHealthFacility = {
      ...existing,
      status,
      isOpen: status !== 'closed',
    }
    await putAdminFacilities([optimistic]).catch(() => {})
    await enqueueOfflineOp({ type: 'UPDATE_FACILITY_TYPED', payload: { id, body: { status }, facilityType: 'hospital' } })
    return optimistic
  }

  const facility = await updateAdminHospitalStatusFromApi(id, status)
  await putAdminFacilities([facility]).catch(() => {})
  return facility
}

/**
 * Updates only the capacity/operational status of a hospital using the dedicated
 * PATCH /v1/hospitals/{id}/status endpoint. Only works for hospital type.
 * Falls back to full update for other facility types.
 */
export async function updateAdminHealthFacilityStatus(
  id: string,
  status: AdminHealthFacility['status'],
  facilityType?: AdminHealthFacilityType,
): Promise<AdminHealthFacility> {
  if (USE_MOCK_ADMIN_HEALTH) {
    const facilities = getMockFacilities()
    const index = facilities.findIndex((f) => f.id === id)
    if (index === -1) throw new Error('Facility not found')
    const updated: AdminHealthFacility = { ...facilities[index], status, isOpen: status !== 'closed' }
    mockFacilitiesStore = facilities.map((f, i) => (i === index ? updated : f))
    return updated
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    const existing = await getAdminFacilityById(id)
    if (!existing) throw new Error('المنشأة غير متوفرة في وضع عدم الاتصال')
    const optimistic: AdminHealthFacility = {
      ...existing,
      status,
      isOpen: status !== 'closed',
    }
    await putAdminFacilities([optimistic]).catch(() => {})
    await enqueueOfflineOp({
      type: 'UPDATE_FACILITY_TYPED',
      payload: { id, body: { status }, facilityType },
    })
    return optimistic
  }

  if (!facilityType || facilityType === 'hospital') {
    const updated = await updateAdminHospitalStatusFromApi(id, status)
    await putAdminFacilities([updated]).catch(() => {})
    return updated
  }

  const existing = await fetchAdminHealthFacilityByIdFromApi(id, facilityType)
  const updated = await updateAdminHealthFacilityFromApi(
    id,
    {
      name: existing.name,
      address: existing.address,
      phone: existing.phone,
      region: existing.region,
      imageUrl: existing.imageUrl,
      latitude: existing.latitude,
      longitude: existing.longitude,
      workingDoctors: existing.workingDoctors?.map((doctor) => ({
        ...doctor,
        workingDays: doctor.workingDays ?? [],
        workingHours: doctor.workingHours ?? '',
      })),
      currentMedications: existing.currentMedications,
      workingHours: existing.workingHours,
      workingDays: existing.workingDays,
      status,
    },
    facilityType,
  )
  return updated
}

export async function deleteAdminHealthFacility(
  id: string,
  facilityType?: AdminHealthFacilityType,
): Promise<void> {
  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 400))
    const exists = getMockFacilities().some((f) => f.id === id)
    if (!exists) throw new Error('Facility not found')
    deleteMockFacility(id)
    return
  }

  // Offline: remove from local cache immediately, queue delete for sync
  if (typeof window !== 'undefined' && !navigator.onLine) {
    const db = getOfflineDB()
    await db.adminFacilities.delete(id)
    await enqueueOfflineOp({
      type: 'DELETE_FACILITY_TYPED',
      payload: { id, facilityType },
    })
    delete mockFacilityFormsStore[id]
    return
  }

  await deleteAdminHealthFacilityFromApi(id, facilityType)
  const db = getOfflineDB()
  await db.adminFacilities.delete(id).catch(() => {})
  delete mockFacilityFormsStore[id]
}

export async function fetchAdminHealthContentById(
  id: string,
): Promise<MedicalContentForm> {
  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 300))
    const item = fetchMockContentById(id)
    if (!item) throw new Error('Content not found')
    return mapContentToForm(item)
  }

  try {
    const item = await fetchAdminHealthContentByIdFromApi(id)
    putAdminHealthContent([item]).catch(() => {})
    return mapContentToForm(item)
  } catch {
    const cached = await getAdminHealthContentById(id)
    if (!cached) throw new Error('Content not found')
    return mapContentToForm(cached)
  }
}

export async function createAdminHealthContent(
  form: MedicalContentForm,
): Promise<AdminHealthMedicalContent> {
  const body = mapContentFormToBody(form)

  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 500))
    return createMockContent(body)
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    const optimistic = createMockContent(body)
    await putAdminHealthContent([optimistic]).catch(() => {})
    await enqueueOfflineOp({ type: 'CREATE_HEALTH_CONTENT', payload: { body } })
    return optimistic
  }

  const content = await createAdminHealthContentFromApi(body)
  await putAdminHealthContent([content]).catch(() => {})
  return content
}

export async function updateAdminHealthContent(
  id: string,
  form: MedicalContentForm,
): Promise<AdminHealthMedicalContent> {
  const body = mapContentFormToBody(form)

  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 500))
    return updateMockContent(id, body)
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    const existing = await getAdminHealthContentById(id)
    const optimistic: AdminHealthMedicalContent = { ...(existing ?? { id, date: '', author: '', thumbnailUrl: '', status: 'draft', category: 'first-aid', description: '', body: '', references: '' }), ...body, id }
    await putAdminHealthContent([optimistic]).catch(() => {})
    await enqueueOfflineOp({ type: 'UPDATE_HEALTH_CONTENT', payload: { id, body } })
    return optimistic
  }

  const content = await updateAdminHealthContentFromApi(id, body)
  await putAdminHealthContent([content]).catch(() => {})
  return content
}

export async function deleteAdminHealthContent(id: string): Promise<void> {
  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 400))
    const exists = getMockContent().some((item) => item.id === id)
    if (!exists) throw new Error('Content not found')
    deleteMockContent(id)
    return
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    const db = getOfflineDB()
    await db.adminHealthContent.delete(id).catch(() => {})
    await enqueueOfflineOp({ type: 'DELETE_HEALTH_CONTENT', payload: { id } })
    return
  }

  await deleteAdminHealthContentFromApi(id)
  const db = getOfflineDB()
  await db.adminHealthContent.delete(id).catch(() => {})
}
