'use client'

import type { AdminCommunicationFeedbackData } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_MAIN_COL,
  ADMIN_COMM_SIDE_COL,
  ADMIN_COMM_SPLIT_GRID,
} from '../adminCommunicationStyles'
import AdminCommunicationLiveIndicatorsCard from './AdminCommunicationLiveIndicatorsCard'
import AdminCommunicationWordCloudCard from './AdminCommunicationWordCloudCard'
import AdminCommunicationFeedbackList from './AdminCommunicationFeedbackList'

interface AdminCommunicationFeedbackViewProps {
  feedback: AdminCommunicationFeedbackData
  exporting?: boolean
  onExportReports?: () => void
  onRefreshWordCloud?: () => void
  onSentimentAnalysis?: (id: string) => void
}

export default function AdminCommunicationFeedbackView({
  feedback,
  exporting,
  onExportReports,
  onRefreshWordCloud,
  onSentimentAnalysis,
}: AdminCommunicationFeedbackViewProps) {
  return (
    <div dir="rtl">
      <div className={ADMIN_COMM_SPLIT_GRID}>
        <div className={`${ADMIN_COMM_MAIN_COL} order-1`}>
          <div className="flex flex-col gap-3 sm:gap-4">
            <AdminCommunicationWordCloudCard
              wordCloud={feedback.wordCloud}
              onRefresh={onRefreshWordCloud}
            />
            <AdminCommunicationFeedbackList items={feedback.feedbackItems} />
          </div>
        </div>

        <div className={`${ADMIN_COMM_SIDE_COL} order-2`}>
          <AdminCommunicationLiveIndicatorsCard
            indicators={feedback.liveIndicators}
            exporting={exporting}
            onExport={onExportReports}
            onSentimentAnalysis={onSentimentAnalysis}
          />
        </div>
      </div>
    </div>
  )
}
