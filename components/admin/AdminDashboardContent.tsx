'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { isAdmin } from '@/lib/auth/roleUtils'
import AdminSidebar from './sidebar/AdminSidebar'
import AdminDashboardHeader from './dashboard/AdminDashboardHeader'
import StatCard from './dashboard/StatCard'
import ResponseTimeChart from './dashboard/ResponseTimeChart'
import InformationAccuracy from './dashboard/InformationAccuracy'
import RecentActivity from './dashboard/RecentActivity'
import QuickActions from './dashboard/QuickActions'
import UrgentAlerts from './dashboard/UrgentAlerts'
import { getAdminDashboardData } from './data/adminDashboardService'

export default function AdminDashboardContent() {
  const router = useRouter()
  const { user, role, isLoading, logout } = useAuth()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const dashboardData = getAdminDashboardData()

  useEffect(() => {
    if (!isLoading && role && !isAdmin(role)) {
      router.replace('/dashboard')
    }
  }, [isLoading, role, router])

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex h-full w-full items-center justify-center overflow-x-hidden bg-[#F5F7FA]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
      </div>
    )
  }

  if (!isAdmin(role)) {
    return null
  }

  return (
    <div
      dir="rtl"
      className="admin-dashboard-root flex h-full min-h-0 w-full max-w-full overflow-hidden bg-[#F5F7FA]"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .admin-dashboard-root { overflow-x: hidden !important; }
            .admin-dashboard-main { overflow-x: hidden !important; }
            .admin-desktop-sidebar::-webkit-scrollbar { width: 6px; }
            .admin-desktop-sidebar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
            .admin-desktop-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.35); border-radius: 10px; }
            .admin-mobile-sidebar::-webkit-scrollbar { width: 6px; }
            .admin-mobile-sidebar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
            .admin-mobile-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.35); border-radius: 10px; }

            @media (min-width: 1025px) {
              .admin-mobile-sidebar { display: none !important; }
            }
          `,
        }}
      />

      <AdminSidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        hoveredNav={hoveredNav}
        onHoverNav={setHoveredNav}
        handleLogout={logout}
        user={user}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <main className="admin-dashboard-main custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
          <AdminDashboardHeader
            userName={user?.fullName}
            onMenuOpen={() => setIsMobileOpen(true)}
          />

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardData.stats.map((stat) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                valueColor={stat.valueColor}
              />
            ))}
          </section>

          <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <ResponseTimeChart data={dashboardData.responseTime} />
              <InformationAccuracy percentage={dashboardData.informationAccuracy.percentage} />
              <UrgentAlerts alerts={dashboardData.urgentAlerts} />
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <RecentActivity activities={dashboardData.recentActivities} />
              <QuickActions actions={dashboardData.quickActions} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
