'use client'

import type { AidRequestDto } from '@/schemas/aidApi'
import { ADMIN_AID_BLUE } from './adminAidStyles'

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending:   { label: 'قيد المراجعة', color: '#F59E0B' },
  approved:  { label: 'مقبول',        color: '#22C55E' },
  rejected:  { label: 'مرفوض',        color: '#F44336' },
  fulfilled: { label: 'مُنجز',        color: '#2196F3' },
}

interface AdminAidRequestsTableProps {
  requests: AidRequestDto[]
  font?: string
}

export default function AdminAidRequestsTable({ requests, font = "'Cairo', sans-serif" }: AdminAidRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div
        className="flex min-h-[20vh] items-center justify-center rounded-2xl border border-[#E8EEF5] bg-white"
        style={{ fontFamily: font }}
      >
        <p className="text-sm text-[#64748B]">لا توجد طلبات مساعدة حالياً</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right" style={{ fontFamily: font, tableLayout: 'auto' }}>
          <thead>
            <tr style={{ background: `${ADMIN_AID_BLUE}1A` }}>
              <th className="px-3 py-4 text-right text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">رقم الطلب</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">اسم الزوج</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">اسم الزوجة</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">رقم الهاتف</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">الموقع الحالي</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">الأبناء (ذ/إ)</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">نقطة التوزيع</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">الحالة</th>
              <th className="px-3 py-4 text-center text-[13px] font-semibold text-[#7E7D7D] whitespace-nowrap">تاريخ الطلب</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const statusMeta = STATUS_META[req.status] ?? { label: req.status, color: '#64748B' }
              const date = req.createdAt
                ? new Date(req.createdAt).toLocaleDateString('ar-EG', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })
                : '—'

              const r = req as AidRequestDto & {
                husbandName?: string
                wifeName?: string
                phoneNumber?: string
                currentLocation?: string
                aidOrganizationName?: string
                maleChildrenCount?: number
                femaleChildrenCount?: number
              }

              const distributionPoint = r.aidOrganizationName || r.aidPointId?.slice(0, 8) || '—'

              return (
                <tr key={req.id} className="border-b border-[#EEF2F7] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-3 py-4 text-right">
                    <span className="text-[12px] font-mono text-[#64748B]">
                      {req.id.slice(0, 10)}…
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center text-[13px] font-medium text-[#1e293b]">
                    {r.husbandName || '—'}
                  </td>
                  <td className="px-3 py-4 text-center text-[13px] font-medium text-[#1e293b]">
                    {r.wifeName || '—'}
                  </td>
                  <td className="px-3 py-4 text-center text-[13px] text-[#475569] whitespace-nowrap" dir="ltr">
                    {r.phoneNumber || '—'}
                  </td>
                  <td className="px-3 py-4 text-center text-[13px] text-[#475569]">
                    {r.currentLocation || '—'}
                  </td>
                  <td className="px-3 py-4 text-center text-[13px] text-[#475569] whitespace-nowrap">
                    {(r.maleChildrenCount ?? 0)} ذ / {(r.femaleChildrenCount ?? 0)} إ
                  </td>
                  <td className="px-3 py-4 text-center text-[13px] font-medium text-[#1e293b]">
                    {distributionPoint}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span
                      className="rounded-full px-3 py-1 text-[12px] font-bold whitespace-nowrap"
                      style={{
                        background: `${statusMeta.color}1A`,
                        color: statusMeta.color,
                      }}
                    >
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center text-[13px] text-[#64748B] whitespace-nowrap">
                    {date}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
