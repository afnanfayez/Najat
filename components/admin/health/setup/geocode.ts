const NOMINATIM_REVERSE = 'https://nominatim.openstreetmap.org/reverse'

export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      lat: String(latitude),
      lon: String(longitude),
      'accept-language': 'ar',
      zoom: '18',
    })

    const res = await fetch(`${NOMINATIM_REVERSE}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) return null

    const data = (await res.json()) as { display_name?: string }
    return data.display_name?.trim() || null
  } catch {
    return null
  }
}
