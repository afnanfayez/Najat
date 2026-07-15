import { bilingual, paginateItems, haversineDistanceMeters } from '@/lib/mocks/crud/paginationHelpers'
import { hospitalsResource } from '@/lib/mocks/resources/hospitals.mock'
import { pharmaciesResource } from '@/lib/mocks/resources/pharmacies.mock'
import { labsResource } from '@/lib/mocks/resources/labs.mock'
import { clinicsResource } from '@/lib/mocks/resources/clinics.mock'
import { dentalClinicsResource } from '@/lib/mocks/resources/dentalClinics.mock'

type ProviderType = 'hospital' | 'dental' | 'clinic' | 'pharmacy' | 'lab'

type FacilityLike = Record<string, unknown> & { deletedAt?: string | null }

function allProviders(): Array<Record<string, unknown> & { type: ProviderType }> {
  const tag = (type: ProviderType, store: { getAll(): FacilityLike[] }) =>
    store
      .getAll()
      .filter((item) => !item.deletedAt)
      .map((item) => ({ ...item, type }))

  return [
    ...tag('hospital', hospitalsResource.store),
    ...tag('pharmacy', pharmaciesResource.store),
    ...tag('lab', labsResource.store),
    ...tag('clinic', clinicsResource.store),
    ...tag('dental', dentalClinicsResource.store),
  ]
}

function envelope(data: unknown[], meta: object) {
  return {
    success: true as const,
    statusCode: 200,
    message: bilingual('تم الجلب بنجاح', 'Fetched successfully'),
    data,
    meta,
    timestamp: new Date().toISOString(),
  }
}

export function list(query: URLSearchParams) {
  const type = query.get('type') as ProviderType | null
  const page = Number(query.get('page') ?? '1') || 1
  const limit = Number(query.get('limit') ?? '20') || 20
  const items = type ? allProviders().filter((p) => p.type === type) : allProviders()
  const { pageItems, meta } = paginateItems(items, page, limit)
  return envelope(pageItems, meta)
}

export function nearby(query: URLSearchParams) {
  const type = query.get('type') as ProviderType | null
  const lat = Number(query.get('latitude') ?? '0')
  const lng = Number(query.get('longitude') ?? '0')
  const radius = Number(query.get('radius') ?? '5000')
  const page = Number(query.get('page') ?? '1') || 1
  const limit = Number(query.get('limit') ?? '20') || 20

  const base = type ? allProviders().filter((p) => p.type === type) : allProviders()
  const withDistance = base
    .map((p) => ({
      ...p,
      distance: haversineDistanceMeters(lat, lng, Number(p.latitude), Number(p.longitude)),
    }))
    .filter((p) => p.distance <= radius)
    .sort((a, b) => a.distance - b.distance)

  const { pageItems, meta } = paginateItems(withDistance, page, limit)
  return envelope(pageItems, meta)
}
