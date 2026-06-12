import {
  exportAdminReportsPdfFromApi,
  fetchAdminReportsDashboardFromApi,
} from '@/lib/api/adminReports'
import { ADMIN_REPORTS_DASHBOARD } from '@/lib/mocks/adminReportsMockData'
import { USE_MOCK_ADMIN_REPORTS } from '@/lib/mocks/mockConfig'
import type { AdminReportsDashboard } from '@/schemas/adminReports'

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchAdminReportsDashboard(): Promise<AdminReportsDashboard> {
  if (!USE_MOCK_ADMIN_REPORTS) {
    // TODO: Wire real API when backend adds /v1/admin/reports/* endpoints.
    // Remove NEXT_PUBLIC_ADMIN_REPORTS_MOCK=1 from .env when the endpoint is live.
    return fetchAdminReportsDashboardFromApi()
  }
  await delay()
  return structuredClone(ADMIN_REPORTS_DASHBOARD)
}

export async function exportAdminReportsPdf(): Promise<void> {
  if (!USE_MOCK_ADMIN_REPORTS) {
    const blob = await exportAdminReportsPdfFromApi()
    downloadBlob(blob, 'statistical-reports.pdf')
    return
  }
  await delay(300)
  const blob = new Blob([JSON.stringify(ADMIN_REPORTS_DASHBOARD, null, 2)], {
    type: 'application/json',
  })
  downloadBlob(blob, 'statistical-reports.json')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
