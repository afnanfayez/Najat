import type { AdminReportsDashboard } from '@/schemas/adminReports'

function emptyReportsDashboard(): AdminReportsDashboard {
  return {
    statistical: {
      kpis: [],
      regionalDistribution: {
        title: 'التوزيع الجغرافي',
        subtitle: 'لا توجد بيانات',
        periodTag: '—',
        points: [],
      },
      resourceBreakdown: {
        segments: [],
        totalLabel: 'الإجمالي',
        totalValue: '—',
      },
      responseTime: {
        title: 'وقت الاستجابة',
        volunteers: [],
        beneficiaries: [],
      },
      needyRegions: {
        title: 'المناطق الأكثر حاجة',
        regions: [],
      },
      insight: {
        title: '—',
        body: 'لا توجد تقارير متاحة حالياً',
        actionLabel: '—',
      },
    },
    operations: {
      kpis: [],
      activityBreakdown: {
        segments: [],
        totalLabel: 'الإجمالي',
        totalValue: '—',
      },
      activeRegions: {
        title: 'المناطق النشطة',
        subtitle: 'لا توجد بيانات',
        mapActionLabel: 'عرض الخريطة',
        regions: [],
      },
      dataQuality: {
        title: 'جودة البيانات',
        subtitle: 'لا توجد بيانات',
        gauges: [],
      },
    },
  }
}

export async function fetchAdminReportsDashboard(): Promise<AdminReportsDashboard> {
  return emptyReportsDashboard()
}

export async function exportAdminReportsPdf(): Promise<void> {
  throw { status: 501, message: 'تصدير التقارير غير متاح حالياً' }
}
