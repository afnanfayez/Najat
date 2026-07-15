import { createSingletonStore } from '@/lib/mocks/store/localStore'
import { bodyToRecord, type MockRequestBody } from '@/lib/mocks/formDataUtils'
import { nowIso } from '@/lib/mocks/crud/paginationHelpers'

interface CommunicationCounters {
  tasks: { total: number; pending: number; inProgress: number; completed: number }
  totalBroadcasts: number
  totalFeedback: number
}

const store = createSingletonStore<CommunicationCounters>('adminCommunicationCounters', 1, () => ({
  tasks: { total: 14, pending: 3, inProgress: 5, completed: 6 },
  totalBroadcasts: 9,
  totalFeedback: 42,
}))

function envelope(data: unknown) {
  return { success: true as const, statusCode: 200, data, timestamp: nowIso() }
}

export function getDashboard() {
  return envelope(store.get())
}

export async function createTask(body: MockRequestBody) {
  await bodyToRecord(body)
  const current = store.get()
  store.set({
    ...current,
    tasks: {
      ...current.tasks,
      total: current.tasks.total + 1,
      pending: current.tasks.pending + 1,
    },
  })
  return envelope({ created: true })
}

export async function launchBroadcast(body: MockRequestBody) {
  await bodyToRecord(body)
  const current = store.get()
  store.set({ ...current, totalBroadcasts: current.totalBroadcasts + 1 })
  return envelope({ launched: true })
}

export function exportBroadcasts() {
  return envelope({ exportedAt: nowIso(), broadcasts: store.get().totalBroadcasts })
}

export function exportFeedback() {
  return envelope({ exportedAt: nowIso(), feedback: store.get().totalFeedback })
}
