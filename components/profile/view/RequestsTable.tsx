'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/api/api'
import { getToken } from '@/lib/api/auth'
import { getUserIdFromToken } from '@/lib/auth/tokenIdentity'
import { getAidRequests, putAidRequests } from '@/lib/offline/db'

interface AidRequestItem {
  id: string
  aidOrganizationId?: string
  aidOrganizationName?: string
  husbandName?: string
  wifeName?: string
  phoneNumber?: string
  currentLocation?: string
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  createdAt?: string
}

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  approved: 'مقبول',
  rejected: 'مرفوض',
  fulfilled: 'مكتمل',
}

const statusColors: Record<string, string> = {
  pending: 'text-amber-500 bg-amber-50 border-amber-100',
  approved: 'text-green-600 bg-green-50 border-green-100',
  rejected: 'text-red-500 bg-red-50 border-red-100',
  fulfilled: 'text-blue-500 bg-blue-50 border-blue-100',
}

const formatDate = (isoString?: string) => {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function RequestsTable() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: AidRequestItem[] }>({
    queryKey: ['my-aid-requests'],
    queryFn: async () => {
      const userId = getUserIdFromToken(getToken()) ?? undefined
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return { success: true, data: await getAidRequests(userId) }
      }

      try {
        const result = await request('/v1/aid/requests')
        const requests = Array.isArray(result?.data) ? result.data : []
        await putAidRequests(requests).catch(() => {})
        return result
      } catch (err) {
        const cached = await getAidRequests(userId)
        if (cached.length > 0) return { success: true, data: cached }
        throw err
      }
    },
  })

  const requests = data?.data || []

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-slate-800 font-bold text-base">سجل طلبات المساعدة المقدمة</h3>
      </div>
      <table className="w-full text-sm text-right whitespace-nowrap md:whitespace-normal">
        <thead className="bg-slate-50 text-blue-500 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 font-semibold w-1/4">النوع / الجهة المانحة</th>
            <th className="px-6 py-4 font-semibold w-1/4">التاريخ</th>
            <th className="px-6 py-4 font-semibold w-1/4">الموقع الحالي</th>
            <th className="px-6 py-4 font-semibold w-1/4">الحالة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-bold">
                جاري تحميل طلباتك...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-red-500 font-bold">
                فشل تحميل قائمة الطلبات. يرجى التحقق من الاتصال بالإنترنت.
              </td>
            </tr>
          ) : requests.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-bold">
                لا توجد طلبات مساعدة مقدمة حالياً.
              </td>
            </tr>
          ) : (
            requests.map((req) => {
              const statusClass = statusColors[req.status] || 'text-slate-500 bg-slate-50 border-slate-100'
              const statusText = statusLabels[req.status] || req.status
              return (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-blue-600">
                    {req.aidOrganizationName || `طلب مساعدة (${req.aidOrganizationId})`}
                  </td>
                  <td className="px-6 py-4">{formatDate(req.createdAt)}</td>
                  <td className="px-6 py-4 text-slate-500 font-bold">{req.currentLocation || 'غير محدد'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-black rounded-full border ${statusClass}`}>
                      {statusText}
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
