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
  type AdminActivityMock,
  type AdminDashboardMockData,
  type AdminIconKey,
  type AdminQuickActionMock,
  type AdminStatMock,
  type AdminUrgentAlertMock,
} from '@/lib/mocks/adminDashboardMockData'

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

export type AdminUrgentAlert = AdminUrgentAlertMock

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

export function mapAdminDashboardMock(raw: AdminDashboardMockData = ADMIN_DASHBOARD_MOCK): AdminDashboardData {
  return {
    stats: raw.stats.map(mapStat),
    responseTime: raw.responseTime,
    informationAccuracy: raw.informationAccuracy,
    recentActivities: raw.recentActivities.map(mapActivity),
    quickActions: raw.quickActions.map(mapQuickAction),
    urgentAlerts: raw.urgentAlerts,
  }
}

export function getAdminDashboardData(): AdminDashboardData {
  return mapAdminDashboardMock(ADMIN_DASHBOARD_MOCK)
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  return getAdminDashboardData()
}
