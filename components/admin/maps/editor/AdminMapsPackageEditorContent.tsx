'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { fetchAdminMapsPackageEditor } from '../data/adminMapsService'
import { useSafetyMapData } from '@/hooks/useSafetyMapData'
import type { AdminMapsEditorLayer, AdminMapsPackageEditorData } from '@/schemas/adminMaps'
import type {
  MapDangerZone,
  MapResourcePoint,
  MapSafeRoad,
} from '@/lib/maps/safetyMapTransforms'
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

  const [loading, setLoading] = useState(true)
  const [editorData, setEditorData] = useState<AdminMapsPackageEditorData | null>(null)
  const [layers, setLayers] = useState<AdminMapsEditorLayer[]>([])
  const [activeTool, setActiveTool] = useState<AdminMapsDrawTool>(null)
  const [mobileTab, setMobileTab] = useState<AdminMapsEditorMobileTab>('map')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchAdminMapsPackageEditor()
        if (!cancelled) {
          setEditorData(data)
          setLayers(data.layers)
        }
      } catch {
        if (!cancelled) toast.error('تعذّر تحميل محرر الخرائط')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const mapLayers = useMemo(() => {
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

  function handleLayerToggle(layerId: string) {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, active: !layer.active } : layer
      )
    )
  }

  function handleToolChange(tool: AdminMapsDrawTool) {
    setActiveTool(tool)
  }

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
            <h1 style={ADMIN_PAGE_TITLE_STYLE}>إنشاء حزمة خرائط جديدة</h1>
            <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px', fontSize: 'clamp(12px, 2.5vw, 15px)' }}>
              رسم المسارات، إدارة الطبقات، ومراجعة البلاغات الميدانية قبل النشر
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div
          className="flex min-h-[50vh] items-center justify-center"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      ) : editorData ? (
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
                onToolChange={handleToolChange}
                onLayerToggle={handleLayerToggle}
              />
            </div>

            <div
              className={`flex min-h-[min(52vh,420px)] xl:col-start-2 xl:min-h-0 xl:h-full ${
                mobileTab === 'map' ? 'flex' : 'hidden xl:flex'
              }`}
            >
              <AdminMapsEditorMap layers={layers} mapLayers={mapLayers} />
            </div>

            <div
              className={`h-full xl:col-start-3 ${
                mobileTab === 'feed' ? 'block' : 'hidden xl:block'
              }`}
            >
              <AdminMapsEditorFeedPanel
                verificationRequests={editorData.verificationRequests}
                fieldReports={editorData.fieldReports}
                quickActions={editorData.quickActions}
              />
            </div>
          </div>
        </>
      ) : null}

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
