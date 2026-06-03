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
} from '@/lib/api/adminHealth'
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

  const facilities = getMockFacilities().filter((facility) => {
    if (region !== 'all' && facility.region !== region) return false
    if (status !== 'all' && facility.status !== status) return false
    if (!q) return true
    return (
      facility.name.toLowerCase().includes(q) ||
      facility.address.toLowerCase().includes(q)
    )
  })

  return { facilities, stats: computeMockStats(facilities) }
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
  if (USE_MOCK_ADMIN_HEALTH) {
    return filterMockFacilities(params)
  }

  try {
    return await fetchAdminHealthFacilitiesFromApi(params)
  } catch {
    return filterMockFacilities(params)
  }
}

export async function fetchAdminHealthMedicalContent(
  params: AdminHealthContentQueryParams = {},
): Promise<AdminHealthContentListResponse> {
  if (USE_MOCK_ADMIN_HEALTH) {
    return filterMockContent(params)
  }

  try {
    return await fetchAdminHealthContentFromApi(params)
  } catch {
    return filterMockContent(params)
  }
}

export async function fetchAdminHealthLatestContent(
  limit = 3,
): Promise<AdminHealthMedicalContent[]> {
  const { items } = await fetchAdminHealthMedicalContent({ limit })
  return items
}

export type AdminHealthFilterState = {
  search: string
  region: AdminHealthRegionFilter
  status: AdminHealthStatusFilter
}

export function toFacilitiesQueryParams(
  filters: AdminHealthFilterState,
): AdminHealthFacilitiesQueryParams {
  return {
    search: filters.search.trim() || undefined,
    region: filters.region,
    status: filters.status,
  }
}

export function toContentQueryParams(search: string): AdminHealthContentQueryParams {
  return {
    search: search.trim() || undefined,
  }
}

export async function createAdminHealthFacility(
  form: FacilitySetupForm,
): Promise<AdminHealthFacility> {
  const hasImages = form.images.some((img) => img.file)
  const body = mapFacilityFormToCreateBody(form)

  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 500))
    return createMockFacility(body, form)
  }

  try {
    const payload = hasImages ? buildFacilityFormData(form) : body
    const facility = await createAdminHealthFacilityFromApi(payload)
    mockFacilityFormsStore[facility.id] = form
    return facility
  } catch {
    await new Promise((r) => setTimeout(r, 400))
    return createMockFacility(body, form)
  }
}

export async function fetchAdminHealthFacilityById(
  id: string,
): Promise<FacilitySetupForm> {
  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 300))
    const form = fetchMockFacilityById(id)
    if (!form) throw new Error('Facility not found')
    return form
  }

  try {
    const facility = await fetchAdminHealthFacilityByIdFromApi(id)
    return mapFacilityToSetupForm(facility, mockFacilityFormsStore[id])
  } catch {
    const form = fetchMockFacilityById(id)
    if (!form) throw new Error('Facility not found')
    return form
  }
}

export async function updateAdminHealthFacility(
  id: string,
  form: FacilitySetupForm,
): Promise<AdminHealthFacility> {
  const hasImages = form.images.some((img) => img.file)
  const body = mapFacilityFormToCreateBody(form)

  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 500))
    return updateMockFacility(id, body, form)
  }

  try {
    const payload = hasImages ? buildFacilityFormData(form) : body
    const facility = await updateAdminHealthFacilityFromApi(id, payload)
    mockFacilityFormsStore[id] = form
    return facility
  } catch {
    await new Promise((r) => setTimeout(r, 400))
    return updateMockFacility(id, body, form)
  }
}

export async function deleteAdminHealthFacility(id: string): Promise<void> {
  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 400))
    const exists = getMockFacilities().some((f) => f.id === id)
    if (!exists) throw new Error('Facility not found')
    deleteMockFacility(id)
    return
  }

  try {
    await deleteAdminHealthFacilityFromApi(id)
    delete mockFacilityFormsStore[id]
  } catch {
    await new Promise((r) => setTimeout(r, 300))
    deleteMockFacility(id)
  }
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
    return mapContentToForm(item)
  } catch {
    const item = fetchMockContentById(id)
    if (!item) throw new Error('Content not found')
    return mapContentToForm(item)
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

  try {
    return await createAdminHealthContentFromApi(body)
  } catch {
    await new Promise((r) => setTimeout(r, 400))
    return createMockContent(body)
  }
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

  try {
    return await updateAdminHealthContentFromApi(id, body)
  } catch {
    await new Promise((r) => setTimeout(r, 400))
    return updateMockContent(id, body)
  }
}

export async function deleteAdminHealthContent(id: string): Promise<void> {
  if (USE_MOCK_ADMIN_HEALTH) {
    await new Promise((r) => setTimeout(r, 400))
    const exists = getMockContent().some((item) => item.id === id)
    if (!exists) throw new Error('Content not found')
    deleteMockContent(id)
    return
  }

  try {
    await deleteAdminHealthContentFromApi(id)
  } catch {
    await new Promise((r) => setTimeout(r, 300))
    deleteMockContent(id)
  }
}
