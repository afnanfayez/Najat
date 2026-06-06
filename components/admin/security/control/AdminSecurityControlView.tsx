'use client'

import type { AdminSecurityControlData } from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_BOTTOM_MAIN_COL,
  ADMIN_SECURITY_BOTTOM_SIDE_COL,
  ADMIN_SECURITY_SPLIT_GRID,
} from '../adminSecurityStyles'
import AdminSecurityRolesCard from './AdminSecurityRolesCard'
import AdminSecurityEncryptionCard from './AdminSecurityEncryptionCard'
import AdminSecurityAlertsCard from './AdminSecurityAlertsCard'
import AdminSecurityAuditLogCard from './AdminSecurityAuditLogCard'

interface AdminSecurityControlViewProps {
  dashboard: AdminSecurityControlData
  onAddRole?: () => void
  onSavePermissions?: (roleId: string) => void
  onAdvancedPrivacy?: () => void
  onBlockIp?: (alertId: string) => void
  onIgnoreAlert?: (alertId: string) => void
  onViewAuditEntry?: (entryId: string) => void
}

export default function AdminSecurityControlView({
  dashboard,
  onAddRole,
  onSavePermissions,
  onAdvancedPrivacy,
  onBlockIp,
  onIgnoreAlert,
  onViewAuditEntry,
}: AdminSecurityControlViewProps) {
  return (
    <div dir="rtl" className="min-w-0">
      <AdminSecurityRolesCard
        data={dashboard}
        onAddRole={onAddRole}
        onSavePermissions={onSavePermissions}
      />

      <div className={ADMIN_SECURITY_SPLIT_GRID} dir="rtl">
        <div className={`${ADMIN_SECURITY_BOTTOM_MAIN_COL} flex min-w-0 flex-col gap-3 sm:gap-4`}>
          <AdminSecurityAlertsCard
            title={dashboard.alertsTitle}
            activeCount={dashboard.activeAlertsCount}
            alerts={dashboard.alerts}
            onBlockIp={onBlockIp}
            onIgnore={onIgnoreAlert}
          />
          <AdminSecurityAuditLogCard
            title={dashboard.auditTitle}
            entries={dashboard.auditEntries}
            onViewEntry={onViewAuditEntry}
          />
        </div>
        <div className={ADMIN_SECURITY_BOTTOM_SIDE_COL}>
          <AdminSecurityEncryptionCard
            title={dashboard.encryptionTitle}
            protocols={dashboard.encryptionProtocols}
            advancedPrivacyLabel={dashboard.advancedPrivacyLabel}
            onAdvancedPrivacy={onAdvancedPrivacy}
          />
        </div>
      </div>
    </div>
  )
}
