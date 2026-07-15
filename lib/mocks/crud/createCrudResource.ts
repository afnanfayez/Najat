import { createBucketStore } from '@/lib/mocks/store/localStore'
import { checkErrorTrigger, MockHttpError } from '@/lib/mocks/store/errorTriggers'
import { bodyToRecord } from '@/lib/mocks/formDataUtils'
import {
  bilingual,
  nowIso,
  paginateItems,
  haversineDistanceMeters,
} from '@/lib/mocks/crud/paginationHelpers'

type WithId = { id: string; deletedAt?: string | null }
type RequestBody = FormData | Record<string, unknown> | string | null | undefined

export interface CrudResourceConfig<T extends WithId> {
  storageKey: string
  seedVersion: number
  seed: () => T[]
  /** Enables GET /nearby with haversine distance filtering + sorting. */
  latLngFields?: { lat: keyof T; lng: keyof T }
  /** When true, remove() sets deletedAt instead of splicing the item out. */
  softDelete?: boolean
  defaultLimit?: number
}

function envelope<T>(data: T, statusCode = 200) {
  return {
    success: true as const,
    statusCode,
    message: bilingual('تمت العملية بنجاح', 'Operation succeeded'),
    data,
    timestamp: nowIso(),
  }
}

function listEnvelope<T>(data: T[], meta: object, statusCode = 200) {
  return {
    success: true as const,
    statusCode,
    message: bilingual('تم الجلب بنجاح', 'Fetched successfully'),
    data,
    meta,
    timestamp: nowIso(),
  }
}

function notFound(): never {
  throw new MockHttpError(404, 'العنصر غير موجود')
}

export function createCrudResource<T extends WithId>(config: CrudResourceConfig<T>) {
  const store = createBucketStore<T>(config.storageKey, config.seedVersion, config.seed)
  const defaultLimit = config.defaultLimit ?? 20

  function activeItems(): T[] {
    const all = store.getAll()
    return config.softDelete ? all.filter((item) => !item.deletedAt) : all
  }

  function list(query: URLSearchParams) {
    checkErrorTrigger(query.get('since'))
    const page = Number(query.get('page') ?? '1') || 1
    const limit = Number(query.get('limit') ?? String(defaultLimit)) || defaultLimit
    const { pageItems, meta } = paginateItems(activeItems(), page, limit)
    return listEnvelope(pageItems, meta)
  }

  function nearby(query: URLSearchParams) {
    if (!config.latLngFields) notFound()
    checkErrorTrigger(query.get('since'))
    const lat = Number(query.get('latitude') ?? query.get('lat') ?? '0')
    const lng = Number(query.get('longitude') ?? query.get('lng') ?? '0')
    const radius = Number(query.get('radius') ?? '5000')
    const page = Number(query.get('page') ?? '1') || 1
    const limit = Number(query.get('limit') ?? String(defaultLimit)) || defaultLimit
    const { lat: latKey, lng: lngKey } = config.latLngFields

    const withDistance = activeItems()
      .map((item) => ({
        ...item,
        distance: haversineDistanceMeters(
          lat,
          lng,
          Number(item[latKey]),
          Number(item[lngKey]),
        ),
      }))
      .filter((item) => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    const { pageItems, meta } = paginateItems(withDistance, page, limit)
    return listEnvelope(pageItems, meta)
  }

  function getById(id: string) {
    checkErrorTrigger(id)
    const found = store.getAll().find((item) => item.id === id)
    if (!found) notFound()
    return envelope(found)
  }

  async function create(body: RequestBody) {
    const record = await bodyToRecord(body)
    const now = nowIso()
    const newItem = {
      ...record,
      id: `${config.storageKey}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    } as unknown as T
    store.setAll([...store.getAll(), newItem])
    return envelope(newItem, 201)
  }

  async function update(id: string, body: RequestBody) {
    checkErrorTrigger(id)
    const record = await bodyToRecord(body)
    const all = store.getAll()
    const idx = all.findIndex((item) => item.id === id)
    if (idx === -1) notFound()
    const updated = { ...all[idx], ...record, id, updatedAt: nowIso() } as T
    const next = [...all]
    next[idx] = updated
    store.setAll(next)
    return envelope(updated)
  }

  function remove(id: string) {
    checkErrorTrigger(id)
    const all = store.getAll()
    const idx = all.findIndex((item) => item.id === id)
    if (idx === -1) notFound()
    if (config.softDelete) {
      const next = [...all]
      next[idx] = { ...next[idx], deletedAt: nowIso() } as T
      store.setAll(next)
    } else {
      store.setAll(all.filter((item) => item.id !== id))
    }
    return envelope({ success: true })
  }

  async function updateStatus(id: string, body: RequestBody, statusField = 'status') {
    checkErrorTrigger(id)
    const record = await bodyToRecord(body)
    const value = record[statusField] ?? record.status
    const all = store.getAll()
    const idx = all.findIndex((item) => item.id === id)
    if (idx === -1) notFound()
    const updated = { ...all[idx], [statusField]: value, updatedAt: nowIso() } as T
    const next = [...all]
    next[idx] = updated
    store.setAll(next)
    return envelope(updated)
  }

  return { list, nearby, getById, create, update, remove, updateStatus, store }
}

export type CrudResource<T extends WithId> = ReturnType<typeof createCrudResource<T>>
