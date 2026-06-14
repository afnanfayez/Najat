import { Suspense } from 'react'
import AdminCustomizationContent from '@/components/admin/customization/AdminCustomizationContent'

export default function AdminCustomizationPage() {
  return (
    <Suspense fallback={null}>
      <AdminCustomizationContent />
    </Suspense>
  )
}
