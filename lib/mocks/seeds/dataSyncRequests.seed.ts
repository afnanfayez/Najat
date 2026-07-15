export interface DataSyncRequestRecord {
  id: string
  entityName: string
  action: string
  description: string
  area: string
  status: 'pending' | 'approved' | 'rejected' | 'published'
  reviewNotes?: string | null
  createdAt: string
  updatedAt?: string | null
}

export function seedDataSyncRequests(): DataSyncRequestRecord[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'sync-001',
      entityName: 'مستشفى الشفاء',
      action: 'تحديث حالة السعة',
      description: 'تحديث السعة إلى "حرجة" بعد ارتفاع عدد الحالات',
      area: 'مدينة غزة',
      status: 'pending',
      createdAt: now,
    },
    {
      id: 'sync-002',
      entityName: 'صيدلية النور',
      action: 'تحديث الأدوية المتوفرة',
      description: 'إضافة أموكسيسيلين للمخزون',
      area: 'خان يونس',
      status: 'approved',
      createdAt: now,
    },
    {
      id: 'sync-003',
      entityName: 'نقطة توزيع الملابس - دير البلح',
      action: 'إنشاء نقطة جديدة',
      description: 'نقطة توزيع ملابس شتوية جديدة',
      area: 'دير البلح',
      status: 'published',
      createdAt: now,
    },
    {
      id: 'sync-004',
      entityName: 'مختبر رفح الطبي',
      action: 'تحديث ساعات العمل',
      description: 'تقليص ساعات العمل بسبب نقص الوقود',
      area: 'رفح',
      status: 'rejected',
      reviewNotes: 'يحتاج توضيح إضافي من مقدم الطلب',
      createdAt: now,
    },
    {
      id: 'sync-005',
      entityName: 'منطقة خطر - خان يونس',
      action: 'تحديث مستوى الخطر',
      description: 'رفع مستوى الخطر إلى "عالٍ"',
      area: 'خان يونس',
      status: 'pending',
      createdAt: now,
    },
  ]
}
