import {
  parseWktLineString,
  parseWktPoint,
  parseWktPolygon,
} from '@/lib/geo/wktParse'

type GeoJsonPoint = { type: 'Point'; coordinates: number[] }
type GeoJsonLineString = { type: 'LineString'; coordinates: number[][] }
type GeoJsonPolygon = { type: 'Polygon'; coordinates: number[][][] }

function toLatLng(lng: number, lat: number): [number, number] | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return [lat, lng]
}

function isGeoJsonObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && 'type' in value
}

/** Accepts WKT or GeoJSON LineString from Najat safety API. */
export function parseLinePositions(input: unknown): [number, number][] {
  if (typeof input === 'string') {
    return parseWktLineString(input)
  }

  if (isGeoJsonObject(input) && input.type === 'LineString') {
    const geo = input as GeoJsonLineString
    if (!Array.isArray(geo.coordinates)) return []
    return geo.coordinates
      .map((pair) => toLatLng(Number(pair[0]), Number(pair[1])))
      .filter((c): c is [number, number] => c != null)
  }

  return []
}

/** Accepts WKT or GeoJSON Point from Najat safety API. */
export function parsePointPosition(input: unknown): [number, number] | null {
  if (typeof input === 'string') {
    return parseWktPoint(input)
  }

  if (isGeoJsonObject(input) && input.type === 'Point') {
    const geo = input as GeoJsonPoint
    if (!Array.isArray(geo.coordinates) || geo.coordinates.length < 2) return null
    return toLatLng(Number(geo.coordinates[0]), Number(geo.coordinates[1]))
  }

  return null
}

/** Accepts WKT or GeoJSON Polygon from Najat safety API. */
export function parsePolygonRings(input: unknown): [number, number][][] {
  if (typeof input === 'string') {
    return parseWktPolygon(input)
  }

  if (isGeoJsonObject(input) && input.type === 'Polygon') {
    const geo = input as GeoJsonPolygon
    if (!Array.isArray(geo.coordinates)) return []
    return geo.coordinates
      .map((ring) =>
        ring
          .map((pair) => toLatLng(Number(pair[0]), Number(pair[1])))
          .filter((c): c is [number, number] => c != null),
      )
      .filter((ring) => ring.length >= 3)
  }

  return []
}
