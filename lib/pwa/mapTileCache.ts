import { MAP_CENTER } from '@/lib/mocks/mapsMockData'
import type { HealthFacility } from '@/schemas/healthFacility'

const CARTO_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const SUBDOMAINS = ['a', 'b', 'c', 'd']

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  )
  return { x, y, n }
}

function buildTileUrl(x: number, y: number, z: number): string {
  const subdomain = SUBDOMAINS[Math.abs(x + y + z) % SUBDOMAINS.length]
  return CARTO_TILE_URL.replace('{s}', subdomain)
    .replace('{z}', String(z))
    .replace('{x}', String(x))
    .replace('{y}', String(y))
    .replace('{r}', '')
}

async function fetchTile(x: number, y: number, z: number, n: number): Promise<void> {
  const wrappedX = ((x % n) + n) % n
  const wrappedY = Math.max(0, Math.min(n - 1, y))
  try {
    await fetch(buildTileUrl(wrappedX, wrappedY, z))
  } catch {
    // ignore individual tile failures
  }
}

export async function precacheTilesForPoint(
  lat: number,
  lng: number,
  zooms: number[] = [13, 14, 15, 16],
  radius = 1,
): Promise<void> {
  for (const z of zooms) {
    const { x, y, n } = latLngToTile(lat, lng, z)
    const tasks: Promise<void>[] = []
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        tasks.push(fetchTile(x + dx, y + dy, z, n))
      }
    }
    await Promise.allSettled(tasks)
  }
}

export async function precacheTilesForBounds(
  south: number,
  west: number,
  north: number,
  east: number,
  zooms: number[] = [13, 14, 15],
): Promise<void> {
  for (const z of zooms) {
    const sw = latLngToTile(south, west, z)
    const ne = latLngToTile(north, east, z)
    const tasks: Promise<void>[] = []
    for (let x = Math.min(sw.x, ne.x); x <= Math.max(sw.x, ne.x); x++) {
      for (let y = Math.min(sw.y, ne.y); y <= Math.max(sw.y, ne.y); y++) {
        tasks.push(fetchTile(x, y, z, sw.n))
      }
    }
    await Promise.allSettled(tasks)
  }
}

export async function precacheAllFacilityMapTiles(
  facilities: Array<{ latitude?: number | null; longitude?: number | null }>,
): Promise<void> {
  const coords = facilities.filter(
    (f) => f.latitude != null && f.longitude != null,
  )
  for (let i = 0; i < coords.length; i++) {
    const f = coords[i]
    await precacheTilesForPoint(f.latitude!, f.longitude!, [14, 15], 1)
    if (i > 0 && i % 5 === 0) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }
}

export async function precacheMainMapArea(): Promise<void> {
  const [lat, lng] = MAP_CENTER
  await precacheTilesForPoint(lat, lng, [13, 14, 15], 1)
}

export async function precacheTilesFromMapView(
  center: [number, number],
  zoom: number,
): Promise<void> {
  const [lat, lng] = center
  const delta = 0.02 * (18 - Math.min(zoom, 18))
  await precacheTilesForBounds(
    lat - delta,
    lng - delta,
    lat + delta,
    lng + delta,
    [zoom, Math.min(zoom + 1, 19)],
  )
}
