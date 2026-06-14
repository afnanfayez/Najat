import type { AdminReportsDashboard } from '@/schemas/adminReports'
import { fetchAdminReportsDashboardFromApi } from '@/lib/api/adminReports'
import { ADMIN_REPORTS_DASHBOARD } from '@/lib/mocks/adminReportsMockData'

export async function fetchAdminReportsDashboard(): Promise<AdminReportsDashboard> {
  try {
    const raw = await fetchAdminReportsDashboardFromApi()
    const ov = raw.overview ?? {}
    const safety = raw.safetyStats ?? {}
    const activity = raw.activitySummary ?? {}
    const mock = ADMIN_REPORTS_DASHBOARD

    return {
      statistical: {
        ...mock.statistical,
        kpis: [
          { id: 'k1', label: 'المستشفيات النشطة', value: String(ov.totalHospitals ?? '—'), tag: 'نشط' },
          { id: 'k2', label: 'نقاط الإغاثة', value: String(ov.totalAidPoints ?? '—'), tag: 'نشطة' },
          { id: 'k3', label: 'المتطوعون', value: String(ov.totalVolunteers ?? '—'), tag: 'مسجل' },
          { id: 'k4', label: 'مناطق الخطر', value: String(ov.totalDangerZones ?? '—'), tag: 'منطقة' },
        ],
      },
      operations: {
        ...mock.operations,
        kpis: [
          { id: 'o1', label: 'تصعيدات نشطة', value: String(safety.activeEscalations ?? '—') },
          { id: 'o2', label: 'مناطق محلولة', value: String(safety.resolvedZones ?? '—') },
          { id: 'o3', label: 'طرق خطرة', value: String(safety.dangerousRoadsCount ?? '—') },
          { id: 'o4', label: 'وقت الاستجابة', value: activity.avgResponseTime ?? '—' },
          { id: 'o5', label: 'رسائل طبية', value: String(activity.medicalDispatches ?? '—') },
        ],
      },
    }
  } catch {
    return ADMIN_REPORTS_DASHBOARD
  }
}

export async function exportAdminReportsPdf(): Promise<void> {
  throw { status: 501, message: 'تصدير التقارير غير متاح حالياً' }
}
