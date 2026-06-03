import { Suspense } from 'react'
import AdminHealthContent from '@/components/admin/health/AdminHealthContent'

export default function AdminHealthPage() {
  return (
    <Suspense fallback={null}>
      <AdminHealthContent />
    </Suspense>
  )
}
