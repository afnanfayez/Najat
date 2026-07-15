import { createBucketStore } from '@/lib/mocks/store/localStore'
import { nowIso } from '@/lib/mocks/crud/paginationHelpers'
import type { AdminAlertDto } from '@/schemas/adminAlert'

function seed(): AdminAlertDto[] {
  const now = nowIso()
  return [
    {
      id: 'alert-001',
      title: 'انقطاع في التيار الكهربائي',
      message: 'تم الإبلاغ عن انقطاع كهربائي مستمر في مستشفى الشفاء منذ ساعتين.',
      severity: 'critical',
      source: 'user_report',
      isResolved: false,
      createdAt: now,
    },
    {
      id: 'alert-002',
      title: 'فشل مزامنة تلقائية',
      message: 'فشلت آخر عملية مزامنة تلقائية لبيانات المرافق الصحية.',
      severity: 'warning',
      source: 'sync',
      isResolved: false,
      createdAt: now,
    },
    {
      id: 'alert-003',
      title: 'ارتفاع في عدد طلبات المساعدة',
      message: 'ارتفاع ملحوظ في عدد طلبات المساعدة في منطقة خان يونس خلال الساعة الماضية.',
      severity: 'warning',
      source: 'system',
      isResolved: false,
      createdAt: now,
    },
    {
      id: 'alert-004',
      title: 'تم حل مشكلة اتصال سابقة',
      message: 'تم استعادة الاتصال بنقطة توزيع المياه في دير البلح.',
      severity: 'warning',
      source: 'system',
      isResolved: true,
      createdAt: now,
    },
  ]
}

const store = createBucketStore<AdminAlertDto>('adminAlerts', 1, seed)

export function getAlerts() {
  return {
    success: true as const,
    statusCode: 200,
    data: store.getAll(),
    timestamp: nowIso(),
  }
}
