'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminCommunicationTabs from './AdminCommunicationTabs'
import AdminCommunicationPageHeader, {
  AdminCommunicationPrimaryButton,
} from './AdminCommunicationPageHeader'
import AdminCommunicationStats from './AdminCommunicationStats'
import AdminCommunicationFiltersBar from './AdminCommunicationFiltersBar'
import AdminCommunicationTaskCard from './AdminCommunicationTaskCard'
import AdminCommunicationPerformanceChart from './AdminCommunicationPerformanceChart'
import AdminCommunicationResilienceCard from './AdminCommunicationResilienceCard'
import AdminCommunicationAddTaskModal from './AdminCommunicationAddTaskModal'
import AdminCommunicationBroadcastView from './broadcast/AdminCommunicationBroadcastView'
import AdminCommunicationFeedbackView from './feedback/AdminCommunicationFeedbackView'
import AdminCommunicationFeedbackStatsRow from './feedback/AdminCommunicationFeedbackStatsRow'
import {
  createAdminCommunicationTask,
  exportAdminCommunicationBroadcastData,
  exportAdminCommunicationFeedbackReports,
  fetchAdminCommunicationDashboard,
  filterAdminCommunicationTasks,
  launchAdminCommunicationBroadcast,
} from './data/adminCommunicationService'
import type {
  AdminCommunicationPriorityFilter,
  AdminCommunicationRegionFilter,
  AdminCommunicationTab,
  AdminCommunicationVolunteerFilter,
  CreateAdminCommunicationTaskBody,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_FONT,
  ADMIN_COMM_PAGE,
  ADMIN_COMM_TAB_META,
} from './adminCommunicationStyles'

export default function AdminCommunicationContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminCommunicationTab>('internal_tasks')
  const [priority, setPriority] = useState<AdminCommunicationPriorityFilter>('all')
  const [region, setRegion] = useState<AdminCommunicationRegionFilter>('all')
  const [volunteer, setVolunteer] = useState<AdminCommunicationVolunteerFilter>('all')
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof fetchAdminCommunicationDashboard>
  > | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminCommunicationDashboard()
      setDashboard(data)
    } catch {
      toast.error('تعذّر تحميل بيانات التواصل والتنسيق')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const filteredTasks = useMemo(() => {
    if (!dashboard) return []
    return filterAdminCommunicationTasks(
      dashboard.tasks,
      priority,
      region,
      volunteer
    )
  }, [dashboard, priority, region, volunteer])

  const tabMeta = ADMIN_COMM_TAB_META[activeTab]

  async function handleCreateTask(body: CreateAdminCommunicationTaskBody) {
    setSaving(true)
    try {
      const updated = await createAdminCommunicationTask(body)
      setDashboard(updated)
      toast.success('تم تعيين المهمة بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تعيين المهمة')
      throw new Error('create failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleLaunchBroadcast(body: LaunchAdminCommunicationBroadcastBody) {
    setSaving(true)
    try {
      const updated = await launchAdminCommunicationBroadcast(body)
      setDashboard(updated)
      toast.success('تم إطلاق البث الجماعي بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر إطلاق البث')
    } finally {
      setSaving(false)
    }
  }

  async function handleExportBroadcast() {
    setExporting(true)
    try {
      await exportAdminCommunicationBroadcastData()
      toast.success('تم تصدير البيانات بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تصدير البيانات')
    } finally {
      setExporting(false)
    }
  }

  async function handleExportFeedbackReports() {
    setExporting(true)
    try {
      await exportAdminCommunicationFeedbackReports()
      toast.success('تم تصدير التقارير بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تصدير التقارير')
    } finally {
      setExporting(false)
    }
  }

  return (
    <AdminShell activeNav="communication">
      <div className={ADMIN_COMM_PAGE}>
        <AdminCommunicationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <AdminCommunicationPageHeader
          title={tabMeta.title}
          subtitle={tabMeta.subtitle}
          sidePanel={
            activeTab === 'feedback_analysis' && dashboard ? (
              <AdminCommunicationFeedbackStatsRow summary={dashboard.feedback.summary} />
            ) : undefined
          }
          action={
            activeTab === 'internal_tasks' ? (
              <AdminCommunicationPrimaryButton onClick={() => setModalOpen(true)}>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white/20">
                  <Plus size={14} strokeWidth={3} />
                </span>
                إضافة مهمة استراتيجية
              </AdminCommunicationPrimaryButton>
            ) : activeTab === 'strategic_broadcast' ? (
              <AdminCommunicationPrimaryButton
                onClick={handleExportBroadcast}
                className={exporting ? 'opacity-70' : ''}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white/20">
                  <Download size={14} strokeWidth={2.5} />
                </span>
                {exporting ? 'جاري التصدير...' : 'تصدير البيانات'}
              </AdminCommunicationPrimaryButton>
            ) : undefined
          }
        />

        {loading ? (
          <div
            className="flex min-h-[40vh] items-center justify-center"
            style={{ fontFamily: ADMIN_COMM_FONT }}
          >
            <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
          </div>
        ) : dashboard && activeTab === 'internal_tasks' ? (
          <>
            <AdminCommunicationStats stats={dashboard.stats} />

            <AdminCommunicationFiltersBar
              priority={priority}
              region={region}
              volunteer={volunteer}
              onPriorityChange={setPriority}
              onRegionChange={setRegion}
              onVolunteerChange={setVolunteer}
            />

            <section className="mb-4 grid min-w-0 grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4">
              {filteredTasks.map((task) => (
                <AdminCommunicationTaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => toast.info('تعديل المهمة — قريباً')}
                />
              ))}
            </section>

            {filteredTasks.length === 0 && (
              <p
                className="mb-6 py-8 text-center text-sm font-medium text-[#64748B]"
                style={{ fontFamily: ADMIN_COMM_FONT }}
              >
                لا توجد مهام مطابقة للفلاتر
              </p>
            )}

            <div
              className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:items-stretch"
              dir="rtl"
            >
              <div className="lg:col-span-8">
                <AdminCommunicationPerformanceChart
                  weeklyData={dashboard.performanceWeekly}
                  monthlyData={dashboard.performanceMonthly}
                />
              </div>
              <div className="lg:col-span-4">
                <AdminCommunicationResilienceCard resilience={dashboard.systemResilience} />
              </div>
            </div>

            <AdminCommunicationAddTaskModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              saving={saving}
              onSubmit={handleCreateTask}
            />
          </>
        ) : dashboard && activeTab === 'strategic_broadcast' ? (
          <AdminCommunicationBroadcastView
            broadcast={dashboard.broadcast}
            saving={saving}
            onLaunch={handleLaunchBroadcast}
            onViewArchive={() => toast.info('الأرشيف الكامل — قريباً')}
          />
        ) : dashboard && activeTab === 'feedback_analysis' ? (
          <AdminCommunicationFeedbackView
            feedback={dashboard.feedback}
            exporting={exporting}
            onExportReports={handleExportFeedbackReports}
            onRefreshWordCloud={() => toast.success('تم تحديث سحابة الكلمات')}
            onSentimentAnalysis={() => toast.info('تحليل المشاعر — قريباً')}
          />
        ) : dashboard ? (
          <div
            className="flex min-h-[40vh] items-center justify-center rounded-xl border border-[#E8EEF5] bg-white p-8"
            style={{ fontFamily: ADMIN_COMM_FONT }}
          >
            <p className="text-center text-sm font-medium text-[#64748B]">
              هذا القسم قيد الإعداد — سيتم ربطه بالباكند قريباً
            </p>
          </div>
        ) : null}
      </div>
    </AdminShell>
  )
}
