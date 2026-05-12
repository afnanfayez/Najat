/** إحداثيات افتراضية (غزة) عند غياب الباق */
export const DEFAULT_HEALTH_MAP_LAT = 31.5
export const DEFAULT_HEALTH_MAP_LON = 34.47

export function openStreetMapEmbedUrl(lat: number, lon: number): string {
  const d = 0.04
  const left = lon - d
  const bottom = lat - d
  const right = lon + d
  const top = lat + d
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    `${left},${bottom},${right},${top}`,
  )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`
}

export function googleMapsSearchUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
}
