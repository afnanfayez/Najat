'use client'

import { CloudOff, RefreshCw } from 'lucide-react'
import { usePendingSyncCount } from '@/hooks/usePendingSyncCount'

export default function AdminOfflineBanner() {
  const { pendingCount, isOnline } = usePendingSyncCount()

  if (isOnline && pendingCount === 0) return null

  if (!isOnline) {
    return (
      <div
        dir="rtl"
        className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <CloudOff size={16} className="shrink-0" />
        <span>
          أنت في وضع عدم الاتصال
          {pendingCount > 0 && ` — ${pendingCount} عملية معلقة ستُزامَن عند عودة الإنترنت`}
        </span>
      </div>
    )
  }

  // Online but still have pending ops (syncing in progress)
  return (
    <div
      dir="rtl"
      className="mb-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <RefreshCw size={16} className="shrink-0 animate-spin" />
      <span>جاري مزامنة {pendingCount} عملية معلقة...</span>
    </div>
  )
}
