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
  ADMIN_ALERT_COLORS,
  ADMIN_DASHBOARD_MOCK,
  type AdminActivityMock,
  type AdminDashboardMockData,
  type AdminIconKey,
  type AdminQuickActionMock,
  type AdminStatMock,
  type AdminUrgentAlertMock,
} from '@/lib/mocks/adminDashboardMockData'
import { fetchAdminUsersStatsFromApi } from '@/lib/api/adminUsers'
import type { AdminUsersStatsDto } from '@/schemas/adminUser'

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

export function mapAdminDashboardMock(raw: AdminDashboardMockData = ADMIN_DASHBOARD_MOCK): AdminDashboardData {
  return {
    stats: raw.stats.map(mapStat),
    responseTime: raw.responseTime,
    informationAccuracy: raw.informationAccuracy,
    recentActivities: raw.recentActivities.map(mapActivity),
    quickActions: raw.quickActions.map(mapQuickAction),
    urgentAlerts: raw.urgentAlerts.map(mapUrgentAlert),
  }
}

export function getAdminDashboardData(): AdminDashboardData {
  return mapAdminDashboardMock(ADMIN_DASHBOARD_MOCK)
}

function formatDashboardNumber(value: number): string {
  return value.toLocaleString('en-US')
}

function mergeUserStats(
  dashboard: AdminDashboardData,
  userStats: AdminUsersStatsDto,
): AdminDashboardData {
  return {
    ...dashboard,
    stats: dashboard.stats.map((stat) => {
      if (stat.id === 'users') {
        return { ...stat, value: formatDashboardNumber(userStats.totalUsers) }
      }
      if (stat.id === 'volunteers') {
        return {
          ...stat,
          value: formatDashboardNumber(userStats.roleBreakdown?.volunteer ?? 0),
        }
      }
      return stat
    }),
  }
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  const dashboard = getAdminDashboardData()

  try {
    const userStats = await fetchAdminUsersStatsFromApi()
    return mergeUserStats(dashboard, userStats)
  } catch {
    return dashboard
  }
}
