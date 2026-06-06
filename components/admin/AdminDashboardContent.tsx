'use client'

import { useAuth } from '@/context/AuthContext'
import AdminShell from './AdminShell'
import AdminDashboardHeader from './dashboard/AdminDashboardHeader'
import StatCard from './dashboard/StatCard'
import ResponseTimeChart from './dashboard/ResponseTimeChart'
import InformationAccuracy from './dashboard/InformationAccuracy'
import RecentActivity from './dashboard/RecentActivity'
import QuickActions from './dashboard/QuickActions'
import UrgentAlerts from './dashboard/UrgentAlerts'
import { getAdminDashboardData } from './data/adminDashboardService'

function AdminDashboardMain() {
  const { user } = useAuth()
  const dashboardData = getAdminDashboardData()

  return (
    <>
      <AdminDashboardHeader userName={user?.fullName} />

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
    </>
  )
}

export default function AdminDashboardContent() {
  return (
    <AdminShell activeNav="dashboard">
      <AdminDashboardMain />
    </AdminShell>
  )
}
