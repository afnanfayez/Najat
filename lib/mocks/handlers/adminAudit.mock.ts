import { createBucketStore } from '@/lib/mocks/store/localStore'
import { bodyToRecord, type MockRequestBody } from '@/lib/mocks/formDataUtils'
import { nowIso } from '@/lib/mocks/crud/paginationHelpers'
import { MockHttpError } from '@/lib/mocks/store/errorTriggers'
import { seedAuditReports, type AuditReportRecord } from '@/lib/mocks/seeds/auditReports.seed'

const store = createBucketStore<AuditReportRecord>('adminAuditReports', 1, seedAuditReports)

function envelope(data: unknown) {
  return { success: true as const, statusCode: 200, data, timestamp: nowIso() }
}

export function getDashboard() {
  const reports = store.getAll()
  return envelope({
    approvedCount: reports.filter((r) => r.status === 'approved').length,
    pendingCount: reports.filter((r) => r.status === 'pending').length,
    rejectedCount: reports.filter((r) => r.status === 'rejected').length,
    complianceRating: 92,
  })
}

export function listReports(_query: URLSearchParams) {
  return envelope(store.getAll())
}

export function compareReport(reportId: string) {
  const report = store.getAll().find((r) => r.id === reportId)
  if (!report) throw new MockHttpError(404, 'التقرير غير موجود')
  return envelope({
    id: `compare-${reportId}`,
    reportId,
    title: 'مقارنة الإصدارات',
    subtitle: report.facilityName,
    changes: [],
    recoveryBullets: [],
    recoveryWarning: '',
    versions: [
      { id: `${reportId}-v1`, badge: 'الحالي', badgeTone: 'current', timestamp: report.createdAt, versionCode: 'v1', changedBy: report.reporter },
    ],
  })
}

export function exportReport(reportId: string) {
  const report = store.getAll().find((r) => r.id === reportId)
  return envelope(report ?? {})
}

export function exportAll() {
  return envelope(store.getAll())
}

export function restoreVersion(reportId: string, _versionId: string) {
  return envelope({ id: reportId, restored: true })
}

export function rejectReport(reportId: string) {
  const all = store.getAll()
  const idx = all.findIndex((r) => r.id === reportId)
  if (idx === -1) throw new MockHttpError(404, 'التقرير غير موجود')
  const next = [...all]
  next[idx] = { ...next[idx], status: 'rejected' }
  store.setAll(next)
  return envelope({ id: reportId })
}

export async function updateReport(reportId: string, body: MockRequestBody) {
  const record = await bodyToRecord(body)
  const all = store.getAll()
  const idx = all.findIndex((r) => r.id === reportId)
  if (idx === -1) throw new MockHttpError(404, 'التقرير غير موجود')
  const next = [...all]
  next[idx] = {
    ...next[idx],
    facilityName: (record.title as string) ?? next[idx].facilityName,
    targetLocation: (record.description as string) ?? next[idx].targetLocation,
  }
  store.setAll(next)
  return envelope(next[idx])
}
