import L from 'leaflet'

const LEAFLET_ASSETS = '/assets/leaflet'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: `${LEAFLET_ASSETS}/marker-icon.png`,
  iconRetinaUrl: `${LEAFLET_ASSETS}/marker-icon-2x.png`,
  shadowUrl: `${LEAFLET_ASSETS}/marker-shadow.png`,
})

export const blueMarkerIcon = new L.Icon({
  iconUrl: `${LEAFLET_ASSETS}/marker-icon-blue-2x.png`,
  shadowUrl: `${LEAFLET_ASSETS}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export const CARTO_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
