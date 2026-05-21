import { describe, expect, it } from 'vitest'
import {
  parseLinePositions,
  parsePointPosition,
  parsePolygonRings,
} from '@/lib/geo/geometryParse'
import { parseSafetyMapResponse } from '@/lib/api/safety'
import { transformMapDataLayers } from '@/lib/maps/safetyMapTransforms'

const API_SAMPLE = {
  success: true,
  statusCode: 200,
  data: {
    data: {
      dangerZones: [
        {
          id: 'da90c32e-1a0d-4b4e-a02e-8188e2cc86ca',
          description: 'مناطق قصف مدفعي عشوائي - شرق خانيونس',
          dangerLevel: 'high',
          area: {
            type: 'Polygon',
            coordinates: [
              [
                [34.32, 31.32],
                [34.35, 31.32],
                [34.35, 31.35],
                [34.32, 31.35],
                [34.32, 31.32],
              ],
            ],
          },
          isActive: true,
          deletedAt: null,
        },
      ],
      safeRoads: [
        {
          id: '2fcdd8ac-91f4-44f3-87a7-0630219462df',
          name: 'طريق صلاح الدين (مقطع وسط)',
          description: 'مسار آمن نسبياً خلال ساعات النهار',
          path: {
            type: 'LineString',
            coordinates: [
              [34.3442, 31.4167],
              [34.3942, 31.4667],
            ],
          },
          isActive: true,
          deletedAt: null,
        },
      ],
      resourcePoints: [
        {
          id: '150f83c9-c6fa-4e21-9a5a-cf8bee1d8452',
          name: 'نقطة تعبئة مياه حلوة - دير البلح',
          type: 'water',
          location: {
            type: 'Point',
            coordinates: [34.35, 31.42],
          },
          isActive: true,
          deletedAt: null,
        },
      ],
    },
    meta: { syncTimestamp: '2026-05-21T11:44:00.145Z' },
  },
}

describe('geometryParse', () => {
  it('parses WKT LineString', () => {
    const positions = parseLinePositions('LINESTRING(34.465 31.41, 34.47 31.415)')
    expect(positions).toEqual([
      [31.41, 34.465],
      [31.415, 34.47],
    ])
  })

  it('parses GeoJSON LineString', () => {
    const positions = parseLinePositions({
      type: 'LineString',
      coordinates: [
        [34.465, 31.41],
        [34.47, 31.415],
      ],
    })
    expect(positions).toEqual([
      [31.41, 34.465],
      [31.415, 34.47],
    ])
  })

  it('parses GeoJSON Point and Polygon', () => {
    expect(
      parsePointPosition({
        type: 'Point',
        coordinates: [34.35, 31.42],
      }),
    ).toEqual([31.42, 34.35])

    const rings = parsePolygonRings({
      type: 'Polygon',
      coordinates: [
        [
          [34.46, 31.55],
          [34.49, 31.55],
          [34.49, 31.58],
          [34.46, 31.55],
        ],
      ],
    })
    expect(rings[0]?.length).toBe(4)
  })
})

describe('safety map API parsing', () => {
  it('parses the live nested API envelope', () => {
    const layers = parseSafetyMapResponse(API_SAMPLE)
    expect(layers.safeRoads).toHaveLength(1)
    expect(layers.dangerZones).toHaveLength(1)
    expect(layers.resourcePoints).toHaveLength(1)
    expect(layers.safeRoads[0]?.path).toMatchObject({ type: 'LineString' })
  })

  it('transforms parsed layers for Leaflet', () => {
    const layers = parseSafetyMapResponse(API_SAMPLE)
    const transformed = transformMapDataLayers(layers)
    expect(transformed.safeRoads[0]?.positions.length).toBeGreaterThanOrEqual(2)
    expect(transformed.dangerZones[0]?.rings[0]?.length).toBeGreaterThanOrEqual(3)
    expect(transformed.resourcePoints[0]?.position).toEqual([31.42, 34.35])
  })
})
