'use client'

import type {
  AdminCommunicationBroadcastData,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'
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
    <div
      className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:items-start"
      dir="rtl"
    >
      <div className="lg:col-span-8">
        <AdminCommunicationBroadcastForm saving={saving} onSubmit={onLaunch} />
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-4">
        <AdminCommunicationBroadcastStatsCard stats={broadcast.stats} />
        <AdminCommunicationBroadcastHistoryCard
          history={broadcast.history}
          onViewArchive={onViewArchive}
        />
      </div>
    </div>
  )
}
