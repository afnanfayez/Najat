'use client'

import type {
  AdminCommunicationBroadcastData,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_MAIN_COL,
  ADMIN_COMM_SIDE_COL,
  ADMIN_COMM_SPLIT_GRID,
} from '../adminCommunicationStyles'
import AdminCommunicationBroadcastForm from './AdminCommunicationBroadcastForm'
import AdminCommunicationBroadcastStatsCard from './AdminCommunicationBroadcastStatsCard'
import AdminCommunicationBroadcastHistoryCard from './AdminCommunicationBroadcastHistoryCard'

interface AdminCommunicationBroadcastViewProps {
  broadcast: AdminCommunicationBroadcastData
  saving?: boolean
  onLaunch: (body: LaunchAdminCommunicationBroadcastBody) => void | Promise<void>
  onViewArchive?: () => void
}

export default function AdminCommunicationBroadcastView({
  broadcast,
  saving,
  onLaunch,
  onViewArchive,
}: AdminCommunicationBroadcastViewProps) {
  return (
    <div className={ADMIN_COMM_SPLIT_GRID} dir="rtl">
      <div className={ADMIN_COMM_MAIN_COL}>
        <AdminCommunicationBroadcastForm saving={saving} onSubmit={onLaunch} />
      </div>

      <div className={ADMIN_COMM_SIDE_COL}>
        <AdminCommunicationBroadcastStatsCard stats={broadcast.stats} />
        <AdminCommunicationBroadcastHistoryCard
          history={broadcast.history}
          onViewArchive={onViewArchive}
        />
      </div>
    </div>
  )
}
