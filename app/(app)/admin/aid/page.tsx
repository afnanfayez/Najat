import { Suspense } from 'react'
import AdminAidContent from '@/components/admin/aid/AdminAidContent'

export default function AdminAidPage() {
  return (
    <Suspense fallback={null}>
      <AdminAidContent />
    </Suspense>
  )
}
