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

interface VolunteerMockTask {
  id: string
  title: string
  description: string
  volunteerId: string
  priority: string
  dueDate: string
  dueTime: string
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: string
  updatedAt: string
}

const mockVolunteerTasksStore = createSingletonStore<VolunteerMockTask[]>('volunteerTasks', 1, () => [
  {
    id: 'vol-task-101',
    title: 'توزيع طرود غذائية طارئة',
    description: 'توزيع 50 طرد غذائي على العائلات المتضررة في حي الزيتون بالتنسيق مع لجنة الإغاثة المحلية.',
    volunteerId: 'user-volunteer-001',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '03:00 م',
    status: 'pending',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'vol-task-102',
    title: 'مرافقة حالات مرضية إلى مستشفى الشفاء',
    description: 'مرافقة مريض كلى وتسهيل دخوله إلى قسم الرعاية الطبية ومتابعة العلاج مع الطبيب المناوب.',
    volunteerId: 'user-volunteer-001',
    priority: 'urgent',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '05:30 م',
    status: 'in_progress',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'vol-task-103',
    title: 'مسح ميداني للاحتياجات الطبية',
    description: 'حصر احتياجات الأدوية والمستلزمات الطبية في مركز الإيواء شمال القطاع.',
    volunteerId: 'user-volunteer-001',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '09:00 ص',
    status: 'pending',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'vol-task-104',
    title: 'إيصال حقائب الإسعافات الأولية',
    description: 'تسليم حقائب إسعافية وأجهزة قياس الضغط لنقطة الطوارئ الميدانية في خان يونس.',
    volunteerId: 'user-volunteer-001',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:00 ص',
    status: 'completed',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'vol-task-105',
    title: 'دعم فريق الاستجابة في مخيم جباليا',
    description: 'المشاركة مع فريق الدفاع المدني والإغاثة في تقديم الدعم الميداني العاجل للأسر النازحة.',
    volunteerId: 'user-volunteer-001',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '02:00 م',
    status: 'pending',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
])

export function listVolunteerTasks() {
  const tasks = mockVolunteerTasksStore.get()
  return envelope(tasks)
}

export async function updateVolunteerTaskStatus(id: string, body: MockRequestBody) {
  const parsed = await bodyToRecord(body)
  const tasks = mockVolunteerTasksStore.get()
  const status = String(parsed.status ?? 'pending') as 'pending' | 'in_progress' | 'completed'

  const updatedTasks = tasks.map((t) =>
    t.id === id ? { ...t, status, updatedAt: nowIso() } : t,
  )
  mockVolunteerTasksStore.set(updatedTasks)

  const found = updatedTasks.find((t) => t.id === id) ?? { id, status }
  return envelope(found)
}

export function exportFeedback() {
  return envelope({ exportedAt: nowIso(), feedback: store.get().totalFeedback })
}
