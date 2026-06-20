'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../../AdminShell'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../../layout/adminLayoutStyles'
import AdminMapsEditorMap from './AdminMapsEditorMap'
import AdminMapsEditorToolsPanel, {
  type AdminMapsDrawTool,
} from './AdminMapsEditorToolsPanel'
import AdminMapsEditorFeedPanel from './AdminMapsEditorFeedPanel'
import AdminMapsEditorMobileTabs, {
  type AdminMapsEditorMobileTab,
} from './adminMapsEditorMobileTabs'
import { getEditorFeedData } from '../data/adminMapsService'
import { useSafetyMapData } from '@/hooks/useSafetyMapData'
import { useSafetyAdminMutations } from '@/hooks/useSafetyAdminMutations'
import type { AdminMapsEditorLayer, AdminMapsPackageEditorData, AdminMapsQuickAction } from '@/schemas/adminMaps'
import type {
  MapDangerZone,
  MapResourcePoint,
  MapSafeRoad,
} from '@/lib/maps/safetyMapTransforms'
import type { AdminMapsEditorMapInnerProps } from './AdminMapsEditorMapInner'
import {
  MAP_DANGER_ORANGE,
  MAP_DANGER_RED,
  MAP_RESOURCE_MARKERS,
  MAP_SAFE_ROUTE,
} from '@/lib/mocks/mapsMockData'
import { ADMIN_MAPS_FONT } from '../adminMapsStyles'

const FALLBACK_MAP_LAYERS = {
  safeRoads: [
    {
      id: 'mock-safe-1',
      name: 'مسار آمن',
      description: '',
      positions: MAP_SAFE_ROUTE,
      isActive: true,
    },
  ] satisfies MapSafeRoad[],
  dangerZones: [
    {
      id: 'mock-danger-red',
      description: 'منطقة خطر',
      dangerLevel: 'high',
      rings: [MAP_DANGER_RED],
      isActive: true,
    },
    {
      id: 'mock-danger-orange',
      description: 'منطقة نزاع',
      dangerLevel: 'medium',
      rings: [MAP_DANGER_ORANGE],
      isActive: true,
    },
  ] satisfies MapDangerZone[],
  resourcePoints: MAP_RESOURCE_MARKERS.map((marker, index) => ({
    id: `mock-resource-${index}`,
    name: marker.name,
    type: 'hospital',
    position: [marker.lat, marker.lng] as [number, number],
    isActive: true,
  })) satisfies MapResourcePoint[],
}

export default function AdminMapsPackageEditorContent() {
  const router = useRouter()
  const mapDataQuery = useSafetyMapData()
  const mutations = useSafetyAdminMutations()

  const [editorData, setEditorData] = useState<AdminMapsPackageEditorData | null>(null)
  const [layers, setLayers] = useState<AdminMapsEditorLayer[]>([])
  const [activeTool, setActiveTool] = useState<AdminMapsDrawTool>(null)
  const [mobileTab, setMobileTab] = useState<AdminMapsEditorMobileTab>('map')
  const [mapFlyTo, setMapFlyTo] = useState<[number, number] | null>(null)
  const [quickActions, setQuickActions] = useState<AdminMapsPackageEditorData['quickActions']>([])
  // Ref to hold the "save in-progress shape" callback exposed by the map inner component
  const saveShapeCallbackRef = useRef<(() => void) | null>(null)

  // Stable callback so tools panel can trigger a shape save
  const handleSaveCurrentShape = useCallback(() => {
    saveShapeCallbackRef.current?.()
  }, [])

  useEffect(() => {
    const data = getEditorFeedData()
    setEditorData(data)
    setLayers(data.layers)
    setQuickActions(data.quickActions)
  }, [])

  const mapLayers = useMemo<Pick<AdminMapsEditorMapInnerProps, 'safeRoads' | 'dangerZones' | 'resourcePoints'>>(() => {
    const hasApiData =
      (mapDataQuery.data?.safeRoads.length ?? 0) > 0 ||
      (mapDataQuery.data?.dangerZones.length ?? 0) > 0 ||
      (mapDataQuery.data?.resourcePoints.length ?? 0) > 0

    if (hasApiData) {
      return {
        safeRoads: mapDataQuery.data?.safeRoads ?? [],
        dangerZones: mapDataQuery.data?.dangerZones ?? [],
        resourcePoints: mapDataQuery.data?.resourcePoints ?? [],
      }
    }

    return FALLBACK_MAP_LAYERS
  }, [mapDataQuery.data])

  /** Called by DrawController when the user finalises a drawn shape. */
  const handleDrawComplete = useCallback(
    async (tool: NonNullable<AdminMapsDrawTool>, geoCoords: number[][]) => {
      setActiveTool(null)

      try {
        let actionMessage = ''
        if (tool === 'danger') {
          const ring = [...geoCoords, geoCoords[0]]
          await mutations.createZone.mutateAsync({
            description: 'منطقة خطر جديدة',
            dangerLevel: 'medium',
            area: { type: 'Polygon', coordinates: [ring] },
            isActive: true,
          })
          toast.success('تمت إضافة منطقة الخطر', { position: 'top-center' })
          actionMessage = `إضافة: منطقة خطر جديدة (${geoCoords.length} نقطة)`
        } else {
          await mutations.createSafeRoad.mutateAsync({
            name: tool === 'safe' ? 'مسار آمن جديد' : 'مسار بديل جديد',
            description: '',
            path: { type: 'LineString', coordinates: geoCoords },
            isActive: true,
          })
          toast.success('تمت إضافة المسار الآمن', { position: 'top-center' })
          actionMessage = tool === 'safe'
            ? `إضافة: مسار آمن جديد (${geoCoords.length} نقطة)`
            : `إضافة: مسار بديل جديد (${geoCoords.length} نقطة)`
        }

        const newAction: AdminMapsQuickAction = {
          id: `action-${Date.now()}`,
          type: 'add',
          message: actionMessage,
        }
        setQuickActions((prev) => [newAction, ...prev.slice(0, 9)])
      } catch {
        // Error toasts are handled inside the mutation hooks.
      }
    },
    [mutations.createZone, mutations.createSafeRoad],
  )

  function handleLayerToggle(layerId: string) {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, active: !layer.active } : layer
      )
    )
  }

  const handleUploadMap = useCallback(async (file: File) => {
    try {
      const text = await file.text()
      const geojson = JSON.parse(text)
      
      let found = false
      const features = geojson.features || (geojson.type === 'Feature' ? [geojson] : [])
      
      for (const feature of features) {
        if (feature.geometry?.type === 'LineString') {
          await mutations.createSafeRoad.mutateAsync({
            name: feature.properties?.name || 'مسار آمن مستورد',
            description: 'مسار مستورد من خريطة أساس',
            path: { type: 'LineString', coordinates: feature.geometry.coordinates },
            isActive: true,
          })
          toast.success('تم استيراد المسار بنجاح', { position: 'top-center' })
          found = true
        } else if (feature.geometry?.type === 'Polygon') {
          await mutations.createZone.mutateAsync({
            description: feature.properties?.name || 'منطقة مستوردة',
            dangerLevel: 'medium',
            area: { type: 'Polygon', coordinates: feature.geometry.coordinates },
            isActive: true,
          })
          toast.success('تم استيراد المنطقة بنجاح', { position: 'top-center' })
          found = true
        }
      }

      if (!found) {
        // Fallback: create a dummy safe road if valid coordinates not found in JSON
        await handleDrawComplete('safe', [
          [34.4668, 31.5016],
          [34.4836, 31.5165]
        ])
        toast.success('تم رفع خريطة الأساس وإضافة مسار افتراضي', { position: 'top-center' })
      }
    } catch (err) {
      console.error(err)
      // Fallback for non-JSON or invalid files
      await handleDrawComplete('safe', [
        [34.4668, 31.5016],
        [34.4836, 31.5165]
      ])
      toast.success('تم رفع خريطة الأساس وإضافة مسار افتراضي', { position: 'top-center' })
    }
  }, [handleDrawComplete, mutations.createSafeRoad, mutations.createZone])

  const isSaving =
    mutations.createZone.isPending || mutations.createSafeRoad.isPending

  return (
    <AdminShell activeNav="maps">
      <header className="mb-4 sm:mb-5" dir="rtl">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 text-right">
            <button
              type="button"
              onClick={() => router.push('/admin/maps')}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] transition-colors hover:text-[#2196F3] sm:text-sm"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              <ArrowRight size={16} />
              العودة إلى مركز الصيانة
            </button>
            <h1 style={ADMIN_PAGE_TITLE_STYLE}>محرر الخرائط الأمنية</h1>
            <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px', fontSize: 'clamp(12px, 2.5vw, 15px)' }}>
              {activeTool
                ? 'انقر على الخريطة لتحديد النقاط — انقر مرتين لحفظ الشكل — Esc للإلغاء'
                : 'اختر أداة رسم لإضافة عنصر جديد أو راجع البيانات الحالية على الخريطة'}
            </p>
          </div>

          {isSaving && (
            <div
              className="flex shrink-0 items-center gap-2 rounded-xl bg-[#E3F2FD] px-4 py-2 text-sm font-bold text-[#2196F3]"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              جاري الحفظ...
            </div>
          )}
        </div>
      </header>

      {editorData ? (
        <>
          <AdminMapsEditorMobileTabs active={mobileTab} onChange={setMobileTab} />

          <div
            className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(250px,280px)_minmax(0,1fr)_minmax(280px,320px)] xl:items-stretch"
            dir="rtl"
            style={{ minHeight: 'min(70vh, calc(100vh - 220px))' }}
          >
            <div
              className={`h-full xl:col-start-1 ${
                mobileTab === 'tools' ? 'block' : 'hidden xl:block'
              }`}
            >
              <AdminMapsEditorToolsPanel
                layers={layers}
                integrity={editorData.integrity}
                activeTool={activeTool}
                onToolChange={setActiveTool}
                onLayerToggle={handleLayerToggle}
                onUploadMap={handleUploadMap}
                onSaveCurrentShape={handleSaveCurrentShape}
              />
            </div>

            <div
              className={`flex min-h-[min(52vh,420px)] xl:col-start-2 xl:min-h-0 xl:h-full ${
                mobileTab === 'map' ? 'flex' : 'hidden xl:flex'
              }`}
            >
              <AdminMapsEditorMap
                layers={layers}
                mapLayers={mapLayers}
                activeTool={activeTool}
                onDrawComplete={handleDrawComplete}
                externalFlyTo={mapFlyTo}
                onSaveCurrentShape={(cb) => { saveShapeCallbackRef.current = cb ?? null }}
              />
            </div>

            <div
              className={`h-full xl:col-start-3 ${
                mobileTab === 'feed' ? 'block' : 'hidden xl:block'
              }`}
            >
              <AdminMapsEditorFeedPanel
                verificationRequests={editorData.verificationRequests}
                fieldReports={editorData.fieldReports}
                quickActions={quickActions}
                onViewLocation={(lat, lng) => setMapFlyTo([lat, lng])}
              />
            </div>
          </div>
        </>
      ) : (
        <div
          className="flex min-h-[50vh] items-center justify-center"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .leaflet-container, .leaflet-container * { box-sizing: content-box !important; }
            .leaflet-container { font-family: 'Cairo', sans-serif; }
          `,
        }}
      />
    </AdminShell>
  )
}
