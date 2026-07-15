export interface AuditReportRecord {
  id: string
  facilityName: string
  issueType: string
  status: 'pending' | 'approved' | 'rejected'
  targetLocation: string
  region: string
  reporter: string
  isUrgent: boolean
  createdAt: string
}

export function seedAuditReports(): AuditReportRecord[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'audit-001',
      facilityName: 'مستشفى الشفاء',
      issueType: 'تحديث سعة العناية المركزة',
      status: 'pending',
      targetLocation: 'مدينة غزة',
      region: 'مدينة غزة',
      reporter: 'محمد إبراهيم عودة',
      isUrgent: true,
      createdAt: now,
    },
    {
      id: 'audit-002',
      facilityName: 'صيدلية النور',
      issueType: 'تحديث توفر الأدوية',
      status: 'approved',
      targetLocation: 'خان يونس',
      region: 'خان يونس',
      reporter: 'لينا حسن الشوا',
      isUrgent: false,
      createdAt: now,
    },
    {
      id: 'audit-003',
      facilityName: 'نقطة توزيع المياه - خان يونس',
      issueType: 'إضافة نقطة توزيع جديدة',
      status: 'pending',
      targetLocation: 'خان يونس',
      region: 'خان يونس',
      reporter: 'خليل النتور',
      isUrgent: true,
      createdAt: now,
    },
    {
      id: 'audit-004',
      facilityName: 'مختبر رفح الطبي',
      issueType: 'تحديث ساعات العمل',
      status: 'rejected',
      targetLocation: 'رفح',
      region: 'رفح',
      reporter: 'سمير الغول',
      isUrgent: false,
      createdAt: now,
    },
    {
      id: 'audit-005',
      facilityName: 'عيادة دير البلح للعظام',
      issueType: 'تحديث بيانات الأطباء',
      status: 'approved',
      targetLocation: 'دير البلح',
      region: 'دير البلح',
      reporter: 'دينا شعث',
      isUrgent: false,
      createdAt: now,
    },
  ]
}
