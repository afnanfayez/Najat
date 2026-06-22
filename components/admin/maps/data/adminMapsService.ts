import type {
  AdminMapsDashboard,
  AdminMapsInsight,
  AdminMapsPackageEditorData,
  AdminMapsPublishLog,
  MapPublishStatus,
  MapRouteClassification,
  MapRouteOperationalStatus,
} from '@/schemas/adminMaps'
import type { SafetyMapLayers } from '@/lib/maps/safetyMapTransforms'
import { ADMIN_MAPS_PACKAGE_EDITOR } from '@/lib/mocks/adminMapsMockData'

/** Convert real safety map layers into the dashboard shape expected by the UI. */
export function buildDashboardFromSafetyData(
  layers: SafetyMapLayers,
): AdminMapsDashboard {
  const totalZones = layers.dangerZones.length
  const totalRoads = layers.safeRoads.length
  const totalPoints = layers.resourcePoints.length
  const totalEntities = totalZones + totalRoads + totalPoints

  const activeEntities =
    layers.dangerZones.filter((z) => z.isActive).length +
    layers.safeRoads.filter((r) => r.isActive).length +
    layers.resourcePoints.filter((p) => p.isActive).length

  const syncPercent =
    totalEntities > 0 ? Math.round((activeEntities / totalEntities) * 100) : 100

  const publishLogs: AdminMapsPublishLog[] = [
    ...layers.dangerZones.map((z) => {
      const isMaintenance = z.description.endsWith(' [MAINTENANCE]')
      const cleanDescription = isMaintenance
        ? z.description.replace(' [MAINTENANCE]', '')
        : z.description
      const opStatus: MapRouteOperationalStatus = !z.isActive
        ? 'closed'
        : isMaintenance
          ? 'maintenance'
          : 'open'

      return {
        id: z.id,
        geographicScope: cleanDescription,
        publishedAt: '—',
        deviceCount: null,
        changeImpact:
          z.dangerLevel === 'high' || z.dangerLevel === 'critical'
            ? 'مستوى الخطر: مرتفع'
            : z.dangerLevel === 'low'
              ? 'مستوى الخطر: منخفض'
              : 'مستوى الخطر: متوسط',
        status: (z.isActive ? 'published' : 'failed') as MapPublishStatus,
        classification: 'danger' as MapRouteClassification,
        operationalStatus: opStatus,
        positions: z.rings[0],
      }
    }),
    ...layers.safeRoads.map((r) => {
      const isMaintenance = r.name.endsWith(' [MAINTENANCE]')
      const cleanName = isMaintenance
        ? r.name.replace(' [MAINTENANCE]', '')
        : r.name
      const opStatus: MapRouteOperationalStatus = !r.isActive
        ? 'closed'
        : isMaintenance
          ? 'maintenance'
          : 'open'

      return {
        id: r.id,
        geographicScope: cleanName,
        publishedAt: '—',
        deviceCount: null,
        changeImpact: r.description || '',
        status: (r.isActive ? 'published' : 'failed') as MapPublishStatus,
        classification: 'safe' as MapRouteClassification,
        operationalStatus: opStatus,
        positions: r.positions,
      }
    }),
    ...layers.resourcePoints.map((p) => {
      const isMaintenance = p.name.endsWith(' [MAINTENANCE]')
      const cleanName = isMaintenance
        ? p.name.replace(' [MAINTENANCE]', '')
        : p.name
      const opStatus: MapRouteOperationalStatus = !p.isActive
        ? 'closed'
        : isMaintenance
          ? 'maintenance'
          : 'open'

      return {
        id: p.id,
        geographicScope: cleanName,
        publishedAt: '—',
        deviceCount: null,
        changeImpact: p.type,
        status: (p.isActive ? 'published' : 'failed') as MapPublishStatus,
        classification: 'alternative' as MapRouteClassification,
        operationalStatus: opStatus,
        position: p.position,
      }
    }),
  ]

  const insights: AdminMapsInsight[] = [
    {
      id: 'zones',
      title: 'مناطق الخطر',
      description:
        totalZones > 0
          ? `${totalZones} منطقة خطر مسجلة في النظام`
          : 'لا توجد مناطق خطر مسجلة حالياً',
      variant: totalZones > 0 ? 'warning' : 'default',
    },
    {
      id: 'roads',
      title: 'المسارات الآمنة',
      description: `${totalRoads} مسار آمن مسجل في النظام`,
    },
    {
      id: 'points',
      title: 'نقاط الموارد',
      description: `${totalPoints} نقطة موارد متاحة للميدان`,
    },
  ]

  const zonePercent =
    totalEntities > 0 ? Math.round((totalZones / totalEntities) * 100) : 0
  const roadPercent =
    totalEntities > 0 ? Math.round((totalRoads / totalEntities) * 100) : 0
  const pointPercent = Math.max(0, 100 - zonePercent - roadPercent)

  return {
    sizes: {
      baseMapSizeMb: parseFloat((totalEntities * 0.4).toFixed(1)),
      differentialDataMb: 0,
      changeRateNote: `${totalEntities} عنصر نشط في قاعدة البيانات`,
    },
    integrity: {
      activePackage: 'بيانات الوقت الفعلي',
      lastSyncAgo: 'منذ لحظات',
      inspectionPoints: totalEntities,
      syncPercent,
      syncSegments: [
        { label: 'مناطق خطر', percent: zonePercent, color: '#EF4444' },
        { label: 'مسارات آمنة', percent: roadPercent, color: '#22C55E' },
        { label: 'نقاط موارد', percent: pointPercent, color: '#2196F3' },
      ],
    },
    publishLogs,
    insights,
  }
}

/** Returns mock feed/quick-actions data for the map editor panel.
 *  Field reports and quick actions have no API backing yet. */
export function getEditorFeedData(): AdminMapsPackageEditorData {
  return structuredClone(ADMIN_MAPS_PACKAGE_EDITOR)
}
