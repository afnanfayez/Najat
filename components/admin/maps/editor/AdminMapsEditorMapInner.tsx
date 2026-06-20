'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, ZoomControl, Polyline, Polygon, useMap } from 'react-leaflet'
import { MAP_CENTER } from '@/lib/mocks/mapsMockData'
import SafetyMapLayersOverlay from '@/components/maps/SafetyMapLayersOverlay'
import type {
  MapDangerZone,
  MapResourcePoint,
  MapSafeRoad,
} from '@/lib/maps/safetyMapTransforms'
import type { AdminMapsDrawTool } from './AdminMapsEditorToolsPanel'
import { ADMIN_MAPS_FONT } from '../adminMapsStyles'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

export interface AdminMapsEditorMapInnerProps {
  showCorridors: boolean
  showConflict: boolean
  showHospitals: boolean
  safeRoads: MapSafeRoad[]
  dangerZones: MapDangerZone[]
  resourcePoints: MapResourcePoint[]
  flyTo: [number, number] | null
  activeTool: AdminMapsDrawTool
  onDrawComplete?: (tool: NonNullable<AdminMapsDrawTool>, geoCoords: number[][]) => void
  /**
   * Registration callback: called once (when the inner component mounts or activeTool changes)
   * with the current save-shape function so the parent can invoke it externally.
   * Pass null to unregister.
   */
  onRequestSaveShape?: (saveFn: (() => void) | null) => void
}

function isMapMounted(map: ReturnType<typeof useMap>) {
  return map.getContainer()?.isConnected === true
}

function ignoreDetachedLeafletError(err: unknown) {
  return (
    err instanceof TypeError &&
    String(err.message).includes('_leaflet_pos')
  )
}

function MapResizeController() {
  const map = useMap()
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isMapMounted(map)) return
      try {
        map.invalidateSize()
      } catch (err) {
        if (!ignoreDetachedLeafletError(err)) throw err
      }
    }, 120)
    return () => window.clearTimeout(timer)
  }, [map])
  return null
}

function FlyController({ flyTo }: { flyTo: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (!flyTo || !isMapMounted(map)) return
    try {
      map.stop()
      map.flyTo(flyTo, 15, { duration: 1.2 })
    } catch (err) {
      if (!ignoreDetachedLeafletError(err)) throw err
    }
  }, [flyTo, map])
  return null
}

interface DrawControllerProps {
  activeTool: AdminMapsDrawTool
  onDrawComplete?: (tool: NonNullable<AdminMapsDrawTool>, geoCoords: number[][]) => void
  /** Ref to expose a save-current-points callback upward */
  saveRef?: React.MutableRefObject<(() => void) | null>
}

/**
 * Captures user clicks on the map when a draw tool is active.
 * - Single click  → add a point to the in-progress shape
 * - Double-click  → finalise the shape and call onDrawComplete
 * - Escape key    → cancel / clear the current shape
 *
 * GeoJSON uses [lng, lat] order; Leaflet uses [lat, lng].
 * Conversion is handled here before calling onDrawComplete.
 */
function DrawController({ activeTool, onDrawComplete, saveRef }: DrawControllerProps) {
  const map = useMap()
  const [points, setPoints] = useState<[number, number][]>([])
  const pointsRef = useRef<[number, number][]>([])

  // Keep ref in sync with state so the save callback always has latest points
  useEffect(() => {
    pointsRef.current = points
  }, [points])

  // Toggle crosshair cursor and double-click zoom based on tool selection.
  useEffect(() => {
    setPoints([])
    pointsRef.current = []
    if (!isMapMounted(map)) return

    if (activeTool) {
      map.doubleClickZoom.disable()
      map.getContainer().style.cursor = 'crosshair'
    } else {
      map.doubleClickZoom.enable()
      map.getContainer().style.cursor = ''
    }

    return () => {
      if (!isMapMounted(map)) return
      map.doubleClickZoom.enable()
      map.getContainer().style.cursor = ''
    }
  }, [activeTool, map])

  // Expose a save callback via saveRef so parent can trigger save externally
  useEffect(() => {
    if (!saveRef) return
    saveRef.current = () => {
      if (!activeTool) return
      const tool: NonNullable<AdminMapsDrawTool> = activeTool
      const minPoints = tool === 'danger' ? 3 : 2
      const currentPoints = pointsRef.current
      if (currentPoints.length < minPoints) return
      const geoCoords = currentPoints.map(([lat, lng]) => [lng, lat])
      onDrawComplete?.(tool, geoCoords)
      setPoints([])
      pointsRef.current = []
    }
  }, [activeTool, onDrawComplete, saveRef])

  // Bind / unbind click and dblclick handlers.
  useEffect(() => {
    if (!activeTool) return

    // Capture as non-nullable so TypeScript can verify the callback signature.
    const tool: NonNullable<AdminMapsDrawTool> = activeTool
    const minPoints = tool === 'danger' ? 3 : 2

    function onClick(e: L.LeafletMouseEvent) {
      setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]])
    }

    function onDblClick(e: L.LeafletMouseEvent) {
      L.DomEvent.stopPropagation(e)
      setPoints((prev) => {
        if (prev.length < minPoints) return prev
        // Convert [lat, lng] → GeoJSON [lng, lat]
        const geoCoords = prev.map(([lat, lng]) => [lng, lat])
        onDrawComplete?.(tool, geoCoords)
        return []
      })
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPoints([])
        pointsRef.current = []
      }
    }

    map.on('click', onClick)
    map.on('dblclick', onDblClick)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      map.off('click', onClick)
      map.off('dblclick', onDblClick)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeTool, map, onDrawComplete])

  if (!points.length) return null

  if (activeTool === 'danger') {
    return (
      <Polygon
        positions={points}
        pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.15, weight: 2 }}
      />
    )
  }

  return (
    <Polyline
      positions={points}
      pathOptions={{
        color: activeTool === 'safe' ? '#22C55E' : '#2196F3',
        weight: 3,
        dashArray: activeTool === 'alternative' ? '8 4' : undefined,
      }}
    />
  )
}

export default function AdminMapsEditorMapInner({
  showCorridors,
  showConflict,
  showHospitals,
  safeRoads,
  dangerZones,
  resourcePoints,
  flyTo,
  activeTool,
  onDrawComplete,
  onRequestSaveShape,
}: AdminMapsEditorMapInnerProps) {
  const anyLayerActive = showCorridors || showConflict || showHospitals
  const saveRef = useRef<(() => void) | null>(null)
  const handleRequestSave = () => {
    saveRef.current?.()
  }

  // Register handleRequestSave callback with parent
  useEffect(() => {
    if (onRequestSaveShape) {
      onRequestSaveShape(handleRequestSave)
      return () => {
        onRequestSaveShape(null)
      }
    }
  }, [onRequestSaveShape])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {activeTool && (
        <button
          type="button"
          onClick={handleRequestSave}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '50%',
            transform: 'translateX(50%)',
            zIndex: 1000,
            background: activeTool === 'danger' ? '#EF4444' : activeTool === 'safe' ? '#22C55E' : '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: ADMIN_MAPS_FONT,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          ✓ حفظ {activeTool === 'danger' ? 'منطقة الخطر' : 'المسار'}
        </button>
      )}
      <MapContainer
        center={MAP_CENTER}
        zoom={14}
        maxZoom={19}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        <ZoomControl position="bottomright" />
        <MapResizeController />
        <FlyController flyTo={flyTo} />
        <DrawController activeTool={activeTool} onDrawComplete={onDrawComplete} saveRef={saveRef} />

        <SafetyMapLayersOverlay
          showSafeRoutes={showCorridors}
          showDangerZones={showConflict}
          showResourceActivity={showHospitals}
          safeRoads={safeRoads}
          dangerZones={dangerZones}
          resourcePoints={resourcePoints}
          fitToLayers={anyLayerActive && !flyTo}
        />
      </MapContainer>
    </div>
  )
}
