'use client'

import type { AdminCommunicationFeedbackData } from '@/schemas/adminCommunication'
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
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <AdminCommunicationLiveIndicatorsCard
            indicators={feedback.liveIndicators}
            exporting={exporting}
            onExport={onExportReports}
            onSentimentAnalysis={onSentimentAnalysis}
          />
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-8">
          <AdminCommunicationWordCloudCard
            wordCloud={feedback.wordCloud}
            onRefresh={onRefreshWordCloud}
          />
          <AdminCommunicationFeedbackList items={feedback.feedbackItems} />
        </div>
      </div>
    </div>
  )
}
