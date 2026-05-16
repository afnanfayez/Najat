import { Suspense } from 'react'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'

function ShellFallback() {
  return (
    <div
      dir="rtl"
      style={{
        padding: 32,
        fontFamily: "'Cairo', sans-serif",
        textAlign: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f7fb',
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
    <Suspense fallback={<ShellFallback />}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </Suspense>
  )
}
