'use client'

import type { AdminSecurityBackupData } from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_SPLIT_GRID,
} from '../adminSecurityStyles'
import AdminSecurityBackupStatsRow from './AdminSecurityBackupStatsRow'
import AdminSecurityBackupWarningBanner from './AdminSecurityBackupWarningBanner'
import AdminSecurityBackupTableCard from './AdminSecurityBackupTableCard'
import AdminSecurityScheduleCard from './AdminSecurityScheduleCard'

interface AdminSecurityBackupViewProps {
  dashboard: AdminSecurityBackupData
  onNewBackup?: () => void
  onPublish?: (backupId: string) => void
  onUpdateSchedule?: (scheduleId: string, storageTargetIds: string[]) => void
}

export default function AdminSecurityBackupView({
  dashboard,
  onNewBackup,
  onPublish,
  onUpdateSchedule,
}: AdminSecurityBackupViewProps) {
  return (
    <div dir="rtl" className="min-w-0">
      <AdminSecurityBackupStatsRow kpis={dashboard.kpis} />
      <AdminSecurityBackupWarningBanner message={dashboard.storageWarning} />

      <div className={`${ADMIN_SECURITY_SPLIT_GRID} lg:items-start`} dir="rtl">
        <div className="min-w-0 order-1 lg:col-span-4">
          <AdminSecurityScheduleCard
            key={`${dashboard.selectedScheduleId}-${dashboard.storageTargets.map((t) => `${t.id}:${t.active}`).join(',')}`}
            scheduleTitle={dashboard.scheduleTitle}
            timelineTitle={dashboard.timelineTitle}
            scheduleOptions={dashboard.scheduleOptions}
            selectedScheduleId={dashboard.selectedScheduleId}
            storageTargetsTitle={dashboard.storageTargetsTitle}
            storageTargets={dashboard.storageTargets}
            updateScheduleLabel={dashboard.updateScheduleLabel}
            onUpdateSchedule={onUpdateSchedule}
          />
        </div>
        <div className="min-w-0 order-2 lg:col-span-8">
          <AdminSecurityBackupTableCard
            title={dashboard.syncRequestsTitle}
            subtitle={dashboard.syncRequestsSubtitle}
            newBackupLabel={dashboard.newBackupLabel}
            publishLabel={dashboard.publishLabel}
            backups={dashboard.backups}
            onNewBackup={onNewBackup}
            onPublish={onPublish}
          />
        </div>
      </div>
    </div>
  )
}
