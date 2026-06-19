'use client'

import { useState } from 'react'
import AdminShell from '../AdminShell'
import AdminAlertsPageHeader from './AdminAlertsPageHeader'
import AdminAlertsTabs from './AdminAlertsTabs'
import AdminAlertManagementCard from './AdminAlertManagementCard'
import AdminAlertsLiveMap from './AdminAlertsLiveMap'
import { useAdminAlerts } from '@/hooks/useAdminAlerts'
import type { AdminAlertsTab } from '@/schemas/adminAlert'

export default function AdminAlertsContent() {
  const [activeTab, setActiveTab] = useState<AdminAlertsTab>('all')
  const { alerts, mapCenter, isLoading, isError } = useAdminAlerts(activeTab)

  return (
    <AdminShell activeNav="alerts">
      <AdminAlertsPageHeader />
      <AdminAlertsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isLoading && (
        <p
          className="py-8 text-center text-sm text-[#64748B]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          جاري تحميل التنبيهات...
        </p>
      )}

      {isError && (
        <p
          className="py-8 text-center text-sm text-[#F44336]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تعذّر تحميل التنبيهات. حاول مرة أخرى.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="flex flex-col gap-4 xl:col-span-7">
            {alerts.map((alert) => (
              <AdminAlertManagementCard key={alert.id} alert={alert} />
            ))}
          </div>

          <div className="xl:col-span-5">
            <AdminAlertsLiveMap alerts={alerts} mapCenter={mapCenter} />
          </div>
        </div>
      )}
    </AdminShell>
  )
}
