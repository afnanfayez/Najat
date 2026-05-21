import { z } from 'zod'
import { bilingualMessageSchema } from '@/schemas/shared'

export const dangerLevelSchema = z.enum(['low', 'medium', 'high', 'critical'])

const geoJsonPointSchema = z
  .object({
    type: z.literal('Point'),
    coordinates: z.array(z.coerce.number()).min(2),
  })
  .passthrough()

const geoJsonLineSchema = z
  .object({
    type: z.literal('LineString'),
    coordinates: z.array(z.array(z.coerce.number()).min(2)),
  })
  .passthrough()

const geoJsonPolygonSchema = z
  .object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.array(z.coerce.number()).min(2))),
  })
  .passthrough()

const geometryLineSchema = z.union([z.string(), geoJsonLineSchema])
const geometryPointSchema = z.union([z.string(), geoJsonPointSchema])
const geometryPolygonSchema = z.union([z.string(), geoJsonPolygonSchema])

export const dangerZoneDtoSchema = z
  .object({
    id: z.string(),
    description: z.string(),
    dangerLevel: z.union([dangerLevelSchema, z.string()]),
    area: geometryPolygonSchema,
    isActive: z.boolean().optional().default(true),
    deletedAt: z.string().nullable().optional(),
  })
  .passthrough()

export const safeRoadDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional().default(''),
    path: geometryLineSchema,
    isActive: z.boolean().optional().default(true),
    deletedAt: z.string().nullable().optional(),
  })
  .passthrough()

export const resourcePointDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    location: geometryPointSchema,
    isActive: z.boolean().optional().default(true),
    deletedAt: z.string().nullable().optional(),
  })
  .passthrough()

export const mapDataLayersSchema = z.object({
  dangerZones: z.array(dangerZoneDtoSchema),
  safeRoads: z.array(safeRoadDtoSchema),
  resourcePoints: z.array(resourcePointDtoSchema),
})

const mapDataEnvelopeSchema = z
  .object({
    data: mapDataLayersSchema,
    meta: z
      .object({
        syncTimestamp: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()

export const mapDataResponseSchema = z
  .object({
    success: z.boolean().optional(),
    statusCode: z.number().optional(),
    message: bilingualMessageSchema.optional(),
    data: z.union([mapDataEnvelopeSchema, mapDataLayersSchema]),
    timestamp: z.string().optional(),
  })
  .passthrough()

export const safetyCheckResponseSchema = z
  .object({
    success: z.boolean().optional(),
    statusCode: z.number().optional(),
    message: bilingualMessageSchema.optional(),
    data: z.object({
      safe: z.boolean(),
      zones: z.array(dangerZoneDtoSchema),
    }),
    timestamp: z.string().optional(),
  })
  .passthrough()

export type DangerZoneDto = z.infer<typeof dangerZoneDtoSchema>
export type SafeRoadDto = z.infer<typeof safeRoadDtoSchema>
export type ResourcePointDto = z.infer<typeof resourcePointDtoSchema>
export type MapDataLayers = z.infer<typeof mapDataLayersSchema>
export type SafetyCheckResult = z.infer<typeof safetyCheckResponseSchema>['data']
