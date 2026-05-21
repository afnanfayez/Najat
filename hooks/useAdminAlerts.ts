'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchAdminAlerts,
  filterAdminAlerts,
  getAdminAlertsMapCenter,
  mapAdminAlertsList,
  type AdminAlertsTab,
} from '@/components/admin/data/adminAlertsService'

export function useAdminAlerts(activeTab: AdminAlertsTab) {
  const query = useQuery({
    queryKey: ['admin-alerts'],
    queryFn: fetchAdminAlerts,
  })

  const alerts = mapAdminAlertsList(query.data?.alerts ?? [])
  const filteredAlerts = filterAdminAlerts(alerts, activeTab)
  const mapCenter = getAdminAlertsMapCenter(query.data)

  return {
    ...query,
    alerts: filteredAlerts,
    mapCenter,
  }
}
