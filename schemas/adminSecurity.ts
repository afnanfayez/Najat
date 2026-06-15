export type AdminSecurityTab = 'backup' | 'security'

export interface AdminSecurityKpi {
  id: string
  label: string
  value: string
}

export interface AdminSecurityBackupItem {
  id: string
  version: string
  filename: string
  timestamp: string
  size: string
  integrityOk: boolean
}

export interface AdminSecurityScheduleOption {
  id: string
  label: string
  sublabel: string
}

export interface AdminSecurityStorageTarget {
  id: string
  label: string
  icon: 'cloud' | 'server'
  active: boolean
}

export interface AdminSecurityBackupData {
  kpis: AdminSecurityKpi[]
  storageWarning: string
  syncRequestsTitle: string
  syncRequestsSubtitle: string
  newBackupLabel: string
  backups: AdminSecurityBackupItem[]
  publishLabel: string
  scheduleTitle: string
  timelineTitle: string
  scheduleOptions: AdminSecurityScheduleOption[]
  selectedScheduleId: string
  storageTargetsTitle: string
  storageTargets: AdminSecurityStorageTarget[]
  updateScheduleLabel: string
}

export interface AdminSecurityRole {
  id: string
  name: string
  description: string
}

export interface AdminSecurityPermission {
  id: string
  label: string
}

export type AdminSecurityProtocolStatus = 'active' | 'inactive'

export interface AdminSecurityEncryptionProtocol {
  id: string
  name: string
  sublabel: string
  status: AdminSecurityProtocolStatus
  icon: 'lock' | 'vault' | 'mask'
}

export interface AdminSecurityAlert {
  id: string
  title: string
  description: string
  blockIpLabel: string
  ignoreLabel: string
}

export type AdminSecurityAuditStatusTone = 'verified' | 'pending'

export interface AdminSecurityAuditEntry {
  id: string
  timestamp: string
  entity: string
  eventType: string
  status: string
  statusTone: AdminSecurityAuditStatusTone
}

export interface AdminSecurityControlData {
  rolesTitle: string
  addRoleLabel: string
  roles: AdminSecurityRole[]
  selectedRoleId: string
  permissionsTitle: string
  permissionsSubtitle: string
  authorizedBadge: string
  permissions: AdminSecurityPermission[]
  savePermissionsLabel: string
  encryptionTitle: string
  encryptionProtocols: AdminSecurityEncryptionProtocol[]
  advancedPrivacyLabel: string
  alertsTitle: string
  activeAlertsCount: number
  alerts: AdminSecurityAlert[]
  auditTitle: string
  auditEntries: AdminSecurityAuditEntry[]
}

export interface AdminSecurityDashboard {
  backup: AdminSecurityBackupData
  security: AdminSecurityControlData
}

/** Matches ScheduleBackupDto required by PUT /admin/security/backup/schedule */
export interface AdminSecurityUpdateScheduleBody {
  cronExpression: string
  isEnabled: boolean
}
