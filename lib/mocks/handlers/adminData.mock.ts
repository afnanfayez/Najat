import { createBucketStore } from '@/lib/mocks/store/localStore'
import { bodyToRecord, type MockRequestBody } from '@/lib/mocks/formDataUtils'
import { nowIso } from '@/lib/mocks/crud/paginationHelpers'
import { MockHttpError } from '@/lib/mocks/store/errorTriggers'
import {
  seedDataSyncRequests,
  type DataSyncRequestRecord,
} from '@/lib/mocks/seeds/dataSyncRequests.seed'

const store = createBucketStore<DataSyncRequestRecord>('adminDataSyncRequests', 1, seedDataSyncRequests)

function envelope(data: unknown) {
  return { success: true as const, statusCode: 200, data, timestamp: nowIso() }
}

function findOrThrow(id: string): DataSyncRequestRecord {
  const found = store.getAll().find((r) => r.id === id)
  if (!found) throw new MockHttpError(404, 'الطلب غير موجود')
  return found
}

function patch(id: string, changes: Partial<DataSyncRequestRecord>): DataSyncRequestRecord {
  const all = store.getAll()
  const idx = all.findIndex((r) => r.id === id)
  if (idx === -1) throw new MockHttpError(404, 'الطلب غير موجود')
  const next = [...all]
  next[idx] = { ...next[idx], ...changes, updatedAt: nowIso() }
  store.setAll(next)
  return next[idx]
}

export function getDashboard() {
  const requests = store.getAll()
  return envelope({
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
    approvedRequests: requests.filter((r) => r.status === 'approved').length,
    rejectedRequests: requests.filter((r) => r.status === 'rejected').length,
    publishedRequests: requests.filter((r) => r.status === 'published').length,
    syncHealth: '98%',
  })
}

export function getSync() {
  return envelope(store.getAll())
}

export function getReview(id: string) {
  return envelope(findOrThrow(id))
}

export function getReport(id: string) {
  return envelope(findOrThrow(id))
}

export function exportSyncCsv() {
  return envelope(store.getAll())
}

export async function submitReview(id: string, body: MockRequestBody) {
  const record = await bodyToRecord(body)
  const status = record.status === 'rejected' ? 'rejected' : 'approved'
  const updated = patch(id, { status, reviewNotes: (record.reviewNotes as string) ?? null })
  return envelope(updated)
}

export function deleteRequest(id: string) {
  findOrThrow(id)
  store.setAll(store.getAll().filter((r) => r.id !== id))
  return envelope({ success: true })
}

export function approveRequest(id: string) {
  return envelope(patch(id, { status: 'approved' }))
}

export function publishRequest(id: string) {
  return envelope(patch(id, { status: 'published' }))
}

export function publishAll() {
  const all = store.getAll()
  const toPublish = all.filter((r) => r.status === 'approved')
  const next = all.map((r) => (r.status === 'approved' ? { ...r, status: 'published' as const, updatedAt: nowIso() } : r))
  store.setAll(next)
  return envelope({
    processed: toPublish.length,
    details: toPublish.map((r) => ({ id: r.id, success: true })),
  })
}
