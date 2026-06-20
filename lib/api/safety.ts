import {
  mapDataLayersSchema,
  dangerZoneDtoSchema,
  safeRoadDtoSchema,
  resourcePointDtoSchema,
  type MapDataLayers,
  type DangerZoneDto,
  type SafeRoadDto,
  type ResourcePointDto,
} from '@/schemas/safetyApi'
import {
  transformMapDataLayers,
  type SafetyMapLayers,
} from '@/lib/maps/safetyMapTransforms'
import { request, unwrapPaginated } from '@/lib/api/api'
import { safetyCheckResponseSchema, type SafetyCheckResult } from '@/schemas/safetyApi'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

const EMPTY_LAYERS: MapDataLayers = {
  dangerZones: [],
  safeRoads: [],
  resourcePoints: [],
}

function findLayerNode(raw: unknown, depth = 0): unknown {
  if (!raw || typeof raw !== 'object' || depth > 6) return null

  const obj = raw as Record<string, unknown>
  if (
    Array.isArray(obj.safeRoads) ||
    Array.isArray(obj.dangerZones) ||
    Array.isArray(obj.resourcePoints)
  ) {
    return obj
  }

  if ('data' in obj) {
    return findLayerNode(obj.data, depth + 1)
  }

  return null
}

/** Parse raw `/safety/map-data` response into layer DTOs. */
export function parseSafetyMapResponse(raw: unknown): MapDataLayers {
  const node = findLayerNode(raw)
  if (!node) return EMPTY_LAYERS

  const parsed = mapDataLayersSchema.safeParse(node)
  if (parsed.success) return parsed.data

  const obj = node as Record<string, unknown>
  return {
    dangerZones: Array.isArray(obj.dangerZones) ? (obj.dangerZones as MapDataLayers['dangerZones']) : [],
    safeRoads: Array.isArray(obj.safeRoads) ? (obj.safeRoads as MapDataLayers['safeRoads']) : [],
    resourcePoints: Array.isArray(obj.resourcePoints)
      ? (obj.resourcePoints as MapDataLayers['resourcePoints'])
      : [],
  }
}

function unwrapSafetyCheck(raw: unknown): SafetyCheckResult {
  const parsed = safetyCheckResponseSchema.safeParse(raw)
  if (parsed.success) return parsed.data.data

  if (raw && typeof raw === 'object' && 'data' in raw) {
    const data = (raw as { data: unknown }).data
    if (data && typeof data === 'object' && 'safe' in data) {
      return safetyCheckResponseSchema.shape.data.parse(data)
    }
  }

  return { safe: true, zones: [] }
}

export type MapDataParams = {
  since?: string
  page?: number
  limit?: number
}

export type CreateDangerZoneBody = {
  description: string
  dangerLevel: string
  area: object
  isActive: boolean
}

export type UpdateDangerZoneBody = Partial<{
  description: string
  dangerLevel: string
  area: object
  isActive: boolean
}>

export type CreateSafeRoadBody = {
  name: string
  description?: string
  path: object
  isActive?: boolean
}

export type CreateResourcePointBody = {
  name: string
  description?: string
  type: string
  location: object
  isActive?: boolean
}

function unwrapEntity<T>(raw: unknown): T {
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return (raw as { data: T }).data
  }
  return raw as T
}

function parseZone(raw: unknown): DangerZoneDto {
  return dangerZoneDtoSchema.parse(unwrapEntity(raw))
}

function parseRoad(raw: unknown): SafeRoadDto {
  return safeRoadDtoSchema.parse(unwrapEntity(raw))
}

function parsePoint(raw: unknown): ResourcePointDto {
  return resourcePointDtoSchema.parse(unwrapEntity(raw))
}

export const safetyAPI = {
  async getMapData(params?: MapDataParams): Promise<SafetyMapLayers> {
    const qs = new URLSearchParams()
    if (params?.since) qs.set('since', params.since)
    if (params?.page != null) qs.set('page', String(params.page))
    if (params?.limit != null) qs.set('limit', String(params.limit))
    const query = qs.toString()

    const raw = await request(
      `${V1_ROOT}/safety/map-data${query ? `?${query}` : ''}`,
    )
    const layers = parseSafetyMapResponse(raw)
    return transformMapDataLayers(layers)
  },

  async check(params: { lat: number; lng: number }): Promise<SafetyCheckResult> {
    const qs = new URLSearchParams()
    qs.set('lat', String(params.lat))
    qs.set('lng', String(params.lng))
    const raw = await request(`${V1_ROOT}/safety/check?${qs}`)
    return unwrapSafetyCheck(raw)
  },

  // ── Danger Zones CRUD ─────────────────────────────────────────────────────

  async listZones(params?: MapDataParams): Promise<DangerZoneDto[]> {
    const qs = new URLSearchParams()
    if (params?.page != null) qs.set('page', String(params.page))
    if (params?.limit != null) qs.set('limit', String(params.limit))
    if (params?.since) qs.set('since', params.since)
    const query = qs.toString()
    const raw = await request(`${V1_ROOT}/safety/zones${query ? `?${query}` : ''}`)
    const unwrapped = unwrapPaginated(raw)
    const envelope = unwrapped as Record<string, unknown>
    const items = Array.isArray(envelope?.data)
      ? envelope.data
      : Array.isArray(unwrapped)
        ? unwrapped
        : []
    return (items as unknown[]).map(parseZone)
  },

  async getZoneById(id: string): Promise<DangerZoneDto> {
    const raw = await request(`${V1_ROOT}/safety/zones/${encodeURIComponent(id)}`)
    return parseZone(raw)
  },

  async createZone(body: CreateDangerZoneBody): Promise<DangerZoneDto> {
    const raw = await request(`${V1_ROOT}/safety/zones`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return parseZone(raw)
  },

  async updateZone(id: string, body: UpdateDangerZoneBody): Promise<DangerZoneDto> {
    const raw = await request(`${V1_ROOT}/safety/zones/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    return parseZone(raw)
  },

  async deleteZone(id: string): Promise<void> {
    await request(`${V1_ROOT}/safety/zones/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  // ── Safe Roads CRUD ───────────────────────────────────────────────────────

  async createSafeRoad(body: CreateSafeRoadBody): Promise<SafeRoadDto> {
    const raw = await request(`${V1_ROOT}/safety/safe-roads`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return parseRoad(raw)
  },

  async deleteSafeRoad(id: string): Promise<void> {
    await request(`${V1_ROOT}/safety/safe-roads/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  // ── Resource Points CRUD ──────────────────────────────────────────────────

  async createResourcePoint(body: CreateResourcePointBody): Promise<ResourcePointDto> {
    const raw = await request(`${V1_ROOT}/safety/resource-points`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return parsePoint(raw)
  },

  async deleteResourcePoint(id: string): Promise<void> {
    await request(`${V1_ROOT}/safety/resource-points/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}
