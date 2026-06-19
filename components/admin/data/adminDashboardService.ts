import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileText,
  Pencil,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react'
import {
  ADMIN_DASHBOARD_MOCK,
  ADMIN_ALERT_COLORS,
  type AdminActivityMock,
  type AdminDashboardMockData,
  type AdminIconKey,
  type AdminQuickActionMock,
  type AdminStatMock,
  type AdminUrgentAlertMock,
} from '@/lib/mocks/adminDashboardMockData'
import { fetchAdminSystemStatsFromApi } from '@/lib/api/adminStats'
import { fetchAdminUsersStatsFromApi } from '@/lib/api/adminUsers'

import { fetchAdminAlertsFromApi } from '@/lib/api/adminAlerts'
import { mapAdminAlertDto } from './adminAlertsService'

const ADMIN_ICONS: Record<AdminIconKey, LucideIcon> = {
  users: Users,
  userPlus: UserPlus,
  checkCircle: CheckCircle2,
  alertTriangle: AlertTriangle,
  pencil: Pencil,
  fileText: FileText,
  barChart: BarChart3,
  settings: Settings,
}

export type AdminStat = Omit<AdminStatMock, 'icon'> & {
  icon: LucideIcon
}

export type AdminActivity = Omit<AdminActivityMock, 'icon'> & {
  icon: LucideIcon
}

export type AdminQuickAction = Omit<AdminQuickActionMock, 'icon'> & {
  icon: LucideIcon
}

export type AdminUrgentAlert = AdminUrgentAlertMock & {
  accentColor: string
}

export type AdminDashboardData = {
  stats: AdminStat[]
  responseTime: AdminDashboardMockData['responseTime']
  informationAccuracy: AdminDashboardMockData['informationAccuracy']
  recentActivities: AdminActivity[]
  quickActions: AdminQuickAction[]
  urgentAlerts: AdminUrgentAlert[]
}

function mapStat(stat: AdminStatMock): AdminStat {
  return { ...stat, icon: ADMIN_ICONS[stat.icon] }
}

function mapActivity(activity: AdminActivityMock): AdminActivity {
  return { ...activity, icon: ADMIN_ICONS[activity.icon] }
}

function mapQuickAction(action: AdminQuickActionMock): AdminQuickAction {
  return { ...action, icon: ADMIN_ICONS[action.icon] }
}

function mapUrgentAlert(alert: AdminUrgentAlertMock): AdminUrgentAlert {
  return {
    ...alert,
    accentColor: ADMIN_ALERT_COLORS[alert.severity],
  }
}

function formatDashboardNumber(value: number): string {
  return value.toLocaleString('en-US')
}

export function getAdminDashboardData(): AdminDashboardData {
  return getBaseLayout()
}

function getBaseLayout(): AdminDashboardData {
  const mock = ADMIN_DASHBOARD_MOCK
  return {
    stats: mock.stats.map(mapStat),
    responseTime: mock.responseTime,
    informationAccuracy: mock.informationAccuracy,
    recentActivities: mock.recentActivities.map(mapActivity),
    quickActions: mock.quickActions.map(mapQuickAction),
    urgentAlerts: mock.urgentAlerts.map(mapUrgentAlert),
  }
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  const dashboard = getBaseLayout()

  const [systemStats, userStats, alertsData] = await Promise.allSettled([
    fetchAdminSystemStatsFromApi(),
    fetchAdminUsersStatsFromApi(),
    fetchAdminAlertsFromApi(),
  ])

  const sys = systemStats.status === 'fulfilled' ? systemStats.value : null
  const usr = userStats.status === 'fulfilled' ? userStats.value : null

  let urgentAlerts = dashboard.urgentAlerts
  if (alertsData.status === 'fulfilled' && alertsData.value?.alerts) {
    const rawAlerts = alertsData.value.alerts
    const sortedAlerts = [...rawAlerts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    let activeAlerts = sortedAlerts.filter((a) => !a.isResolved)
    if (activeAlerts.length === 0) {
      activeAlerts = sortedAlerts
    }

    urgentAlerts = activeAlerts.slice(0, 5).map((alert) => {
      const mapped = mapAdminAlertDto(alert)
      return {
        id: mapped.id,
        title: mapped.title,
        description: mapped.message,
        time: mapped.time,
        severity: mapped.severity === 'critical' ? 'critical' as const : 'warning' as const,
        accentColor: mapped.accentColor,
      }
    })
  }

  const updated: AdminDashboardData = {
    ...dashboard,
    urgentAlerts,
    stats: dashboard.stats.map((stat) => {
      if (stat.id === 'users') {
        const total = usr?.totalUsers ?? sys?.userStats?.totalUsers
        return total != null ? { ...stat, value: formatDashboardNumber(total) } : stat
      }
      if (stat.id === 'volunteers') {
        const vol = usr?.roleBreakdown?.volunteer ?? sys?.userStats?.roleBreakdown?.volunteer
        return vol != null ? { ...stat, value: formatDashboardNumber(vol) } : stat
      }
      if (stat.id === 'tasks') {
        const tasks = sys?.activeActivitiesCount
        return tasks != null ? { ...stat, value: formatDashboardNumber(tasks) } : stat
      }
      if (stat.id === 'alerts') {
        const alerts = sys?.urgentAlertsCount
        return alerts != null ? { ...stat, value: formatDashboardNumber(alerts) } : stat
      }
      return stat
    }),
    informationAccuracy: sys?.informationAccuracy != null
      ? {
          percentage: sys.informationAccuracy > 1
            ? sys.informationAccuracy
            : Math.round(sys.informationAccuracy * 100),
        }
      : dashboard.informationAccuracy,
  }

  return updated
}
