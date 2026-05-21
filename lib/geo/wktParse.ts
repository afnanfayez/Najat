/** Parse WKT geometries from Najat safety API (lng lat order) into Leaflet [lat, lng]. */

function parseCoordPair(pair: string): [number, number] | null {
  const parts = pair.trim().split(/\s+/)
  if (parts.length < 2) return null
  const lng = Number(parts[0])
  const lat = Number(parts[1])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return [lat, lng]
}

export function parseWktPoint(wkt: string): [number, number] | null {
  const match = wkt.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i)
  if (!match) return null
  const lng = Number(match[1])
  const lat = Number(match[2])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return [lat, lng]
}

export function parseWktLineString(wkt: string): [number, number][] {
  const match = wkt.match(/LINESTRING\s*\(([^)]+)\)/i)
  if (!match) return []
  return match[1]
    .split(',')
    .map(parseCoordPair)
    .filter((c): c is [number, number] => c != null)
}

export function parseWktPolygon(wkt: string): [number, number][][] {
  const trimmed = wkt.trim()
  if (!/^POLYGON/i.test(trimmed)) return []

  const inner = trimmed.replace(/^POLYGON\s*\(\(/i, '').replace(/\)\)\s*$/, '')
  const ringStrings = inner.split(/\)\s*,\s*\(/)

  return ringStrings
    .map((ring) =>
      ring
        .replace(/^\(/, '')
        .replace(/\)$/, '')
        .split(',')
        .map(parseCoordPair)
        .filter((c): c is [number, number] => c != null),
    )
    .filter((ring) => ring.length >= 3)
}
