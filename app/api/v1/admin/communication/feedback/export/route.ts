import { exportFeedback } from '@/lib/api-handlers/adminCommunicationHandlers'

export async function GET() {
  return exportFeedback()
}
