import { Suspense } from 'react'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'

function PageFallback() {
  return (
    <div
      dir="rtl"
      style={{
        padding: 32,
        fontFamily: "'Cairo', sans-serif",
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      جاري التحميل...
    </div>
  )
}

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayoutClient>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </DashboardLayoutClient>
  )
}
