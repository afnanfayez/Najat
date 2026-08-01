'use client'

import React, { useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  Phone,
  Star,
  TrendingUp,
  Award,
  Users,
  ChevronLeft,
  RefreshCw,
  FileText,
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Activity,
  X,
} from 'lucide-react'
import ProfileAvatar from '@/components/profile/shared/ProfileAvatar'
import { useVolunteerTasks } from '@/hooks/useVolunteerTasks'
import type { VolunteerTask, VolunteerTaskStatus } from '@/schemas/volunteerApi'

// ─── Priorities & Status Styling Tokens ────────────────────────────────────────

const PRIORITY_TOKENS: Record<
  VolunteerTask['priority'],
  { label: string; bg: string; border: string; text: string; dot: string; glow: string }
> = {
  high: {
    label: 'عاجل جداً',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
    glow: 'shadow-rose-500/10',
  },
  medium: {
    label: 'أولوية متوسطة',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    glow: 'shadow-amber-500/10',
  },
  low: {
    label: 'أولوية عادية',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-600',
    dot: 'bg-sky-500',
    glow: 'shadow-sky-500/10',
  },
}

const STATUS_TOKENS: Record<
  VolunteerTaskStatus,
  { label: string; bg: string; border: string; text: string; stepIndex: number }
> = {
  pending: {
    label: 'قيد الانتظار',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    text: 'text-slate-700',
    stepIndex: 0,
  },
  in_progress: {
    label: 'جارٍ التنفيذ',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-600',
    stepIndex: 1,
  },
  completed: {
    label: 'مكتملة بنجاح',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-600',
    stepIndex: 2,
  },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  accentColor,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  accentColor: string
}) {
  return (
    <div className="group relative overflow-hidden bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ background: accentColor }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 tracking-wide">
            {label}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            {value}
          </span>
          {subtitle && (
            <span className="text-[11px] font-semibold text-slate-500 mt-1">
              {subtitle}
            </span>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110 duration-300"
          style={{ background: accentColor + '18', color: accentColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

function TaskCard({
  task,
  onStart,
  onComplete,
  onSelect,
  isUpdating,
}: {
  task: VolunteerTask
  onStart: (id: string) => void
  onComplete: (id: string) => void
  onSelect: (task: VolunteerTask) => void
  isUpdating: boolean
}) {
  const priority = PRIORITY_TOKENS[task.priority]
  const status = STATUS_TOKENS[task.status]

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between gap-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText size={22} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3
              onClick={() => onSelect(task)}
              className="font-black text-slate-900 text-base leading-snug truncate cursor-pointer hover:text-blue-600 transition-colors"
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-slate-500 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${priority.bg} ${priority.border} ${priority.text}`}
        >
          <span className={`w-2 h-2 rounded-full ${priority.dot} animate-pulse`} />
          {priority.label}
        </span>
      </div>

      {/* Details Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-700 font-bold">
            <Clock size={14} className="text-slate-400" />
            {task.dueLabel}
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <MapPin size={14} className="text-slate-400" />
            الميدان المركز
          </span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.border} ${status.text}`}
        >
          {status.label}
        </span>
      </div>

      {/* Progress Steps Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
        <div
          className={`h-full transition-all duration-500 ${
            task.status === 'completed'
              ? 'w-full bg-emerald-500'
              : task.status === 'in_progress'
              ? 'w-2/3 bg-blue-500'
              : 'w-1/3 bg-slate-300'
          }`}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {task.status === 'pending' && (
          <button
            onClick={() => onStart(task.id)}
            disabled={isUpdating}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <UserCheck size={16} />
            ابدأ تنفيذ المهمة
          </button>
        )}

        {task.status === 'in_progress' && (
          <button
            onClick={() => onComplete(task.id)}
            disabled={isUpdating}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <CheckCircle2 size={16} />
            تأكيد إكمال المهمة
          </button>
        )}

        {task.status === 'completed' && (
          <div className="flex-1 py-2 px-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center border border-emerald-200/80 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} />
            تم إنهاء التكليف بنجاح
          </div>
        )}

        <button
          onClick={() => onSelect(task)}
          className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
          title="عرض التفاصيل"
        >
          <span>التفاصيل</span>
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-12 flex flex-col gap-6 animate-pulse"
      dir="rtl"
    >
      <div className="h-60 bg-slate-200 rounded-3xl w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-80 bg-slate-200 rounded-3xl w-full" />
    </div>
  )
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function VolunteerDashboardContent() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const {
    tasks,
    isLoading: isTasksLoading,
    isError,
    refetch,
    updateStatus,
    isUpdating,
    stats,
  } = useVolunteerTasks()

  const [activeTab, setActiveTab] = useState<
    'all' | 'pending' | 'in_progress' | 'completed'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null)

  // Filter tasks based on search & tab
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesTab = activeTab === 'all' || task.status === activeTab
      const matchesSearch =
        searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [tasks, activeTab, searchQuery])

  const urgentTasks = useMemo(
    () => tasks.filter((t) => t.priority === 'high' && t.status !== 'completed'),
    [tasks],
  )

  const completionRate = useMemo(() => {
    if (stats.total === 0) return '0%'
    return Math.round((stats.completed / stats.total) * 100) + '%'
  }, [stats])

  const handleStart = (id: string) => {
    updateStatus(id, 'in_progress')
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, status: 'in_progress' } : null))
    }
  }

  const handleComplete = (id: string) => {
    updateStatus(id, 'completed')
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, status: 'completed' } : null))
    }
  }

  if (isAuthLoading || isTasksLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-16 flex flex-col gap-6"
      dir="rtl"
    >
      {/* ── Ultra-Modern Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800">
        {/* Ambient Radial Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <ProfileAvatar
                src={user?.avatarUrl}
                size={80}
                borderClassName="border-4 border-white/20 shadow-2xl"
              />
              <span
                className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-lg"
                title="نشط في الميدان"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-400/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                  <ShieldCheck size={14} className="text-blue-400" />
                  بوابة المتطوع الميداني
                </span>
                <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  متصل
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight text-white">
                {user?.fullName ?? 'متطوع نجاة'}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm mt-1 flex items-center gap-2 font-medium">
                <span>المنطقة: {user?.region ?? 'قطاع غزة - الميدان'}</span>
                <span>•</span>
                <span className="text-yellow-300 flex items-center gap-1 font-bold">
                  <Star size={14} className="fill-yellow-300 text-yellow-300" />
                  4.9 (تقييم الأداء)
                </span>
              </p>
            </div>
          </div>

          {/* Quick Hero KPIs */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 p-3 sm:p-4 rounded-2xl shrink-0">
            <div className="px-4 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-white">
                {stats.completed}
              </span>
              <span className="text-xs font-bold text-slate-300">مكتملة</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="px-4 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-blue-300">
                {stats.inProgress}
              </span>
              <span className="text-xs font-bold text-slate-300">جارية</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="px-4 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">
                {completionRate}
              </span>
              <span className="text-xs font-bold text-slate-300">إنجاز</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-rose-800 text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={22} className="shrink-0 text-rose-600" />
            <span className="font-bold">
              تعذّر الاتصال بالخادم. يتم التصفح حالياً من الذاكرة المحلية المخزنة.
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
          >
            <RefreshCw size={15} />
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* ── Metrics Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          icon={<Clock size={24} />}
          label="مهام قيد الانتظار"
          value={stats.pending}
          subtitle="تتطلب البدء والتنفيذ"
          accentColor="#F59E0B"
        />
        <MetricCard
          icon={<TrendingUp size={24} />}
          label="مهام قيد التنفيذ"
          value={stats.inProgress}
          subtitle="جاري متابعتها الآن"
          accentColor="#3B82F6"
        />
        <MetricCard
          icon={<CheckCircle2 size={24} />}
          label="مهام مكتملة"
          value={stats.completed}
          subtitle="تم تسليمها بنجاح"
          accentColor="#10B981"
        />
        <MetricCard
          icon={<Users size={24} />}
          label="إجمالي التكاليف"
          value={stats.total}
          subtitle="مجموع المهام المسندة"
          accentColor="#8B5CF6"
        />
      </div>

      {/* ── Urgent Priority Warning Section ── */}
      {urgentTasks.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-rose-500/10 border-2 border-rose-500/30 rounded-3xl p-5 sm:p-6 shadow-lg shadow-rose-500/5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-bounce">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  مهام طارئة تطلب التدخل السريع
                </h2>
                <p className="text-xs text-rose-700 font-semibold mt-0.5">
                  يرجى البدء في تنفيذ هذه المهام فوراً حسب تعليمات غرفة العمليات
                </p>
              </div>
            </div>
            <span className="bg-rose-600 text-white text-xs font-black rounded-full px-3 py-1 shadow-md">
              {urgentTasks.length} مهمة عاجلة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-4 border border-rose-200/80 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-black">
                    عاجل جداً
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    <Clock size={13} />
                    الموعد: {task.dueLabel}
                  </span>
                  {task.status === 'pending' ? (
                    <button
                      onClick={() => handleStart(task.id)}
                      disabled={isUpdating}
                      className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95 flex items-center gap-1.5"
                    >
                      <UserCheck size={14} />
                      ابدأ الآن
                    </button>
                  ) : (
                    <button
                      onClick={() => handleComplete(task.id)}
                      disabled={isUpdating}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      إنهاء المهمة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Tasks Section & Controls ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-blue-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                مهامي الميدانية المسندة
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              إدارة وتنفيذ كافة المهام الموكلة إليك من قبل إدارة منصة نجاة
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المهام..."
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-100/70 border-b border-slate-200/80">
          {(
            [
              { id: 'all', label: 'كافة المهام', count: tasks.length },
              { id: 'pending', label: 'قيد الانتظار', count: stats.pending },
              { id: 'in_progress', label: 'جارٍ التنفيذ', count: stats.inProgress },
              { id: 'completed', label: 'مكتملة', count: stats.completed },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                  : 'bg-transparent text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tasks Grid List */}
        <div className="p-5 sm:p-7">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                <Activity size={32} />
              </div>
              <p className="font-extrabold text-slate-700 text-base">
                لا توجد مهام تطابق الخيارات المحددة
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                يرجى تعديل مصطلح البحث أو تحديد تبويب مختلف لعرض التكاليف.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStart={handleStart}
                  onComplete={handleComplete}
                  onSelect={setSelectedTask}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <button
          onClick={() => router.push('/profile')}
          className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-right flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-base">
                الملف الشخصي والتنبيهات
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                مراجعة بيانات الاعتماد ورسائل الإدارة
              </p>
            </div>
          </div>
          <ChevronLeft size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
        </button>

        <a
          href="tel:101"
          className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-right flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-base">
                غرفة العمليات وطوارئ نجاة
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                الاتصال الفوري والدعم اللوجستي المباشر
              </p>
            </div>
          </div>
          <ChevronLeft size={20} className="text-slate-300 group-hover:text-rose-600 transition-colors" />
        </a>
      </div>

      {/* ── Task Details Modal ── */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" dir="rtl">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">تفاصيل المهمة</h3>
                  <p className="text-xs text-slate-500">معلومات التكليف الميداني الكاملة</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div>
                <span className="text-xs font-bold text-slate-400">عنوان المهمة</span>
                <h4 className="text-lg font-black text-slate-900 mt-1">
                  {selectedTask.title}
                </h4>
              </div>

              {selectedTask.description && (
                <div>
                  <span className="text-xs font-bold text-slate-400">التفاصيل والتعليمات</span>
                  <p className="text-sm font-semibold text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400">الأولوية</span>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {PRIORITY_TOKENS[selectedTask.priority].label}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400">تاريخ الانتهاء</span>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {selectedTask.dueLabel}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              {selectedTask.status === 'pending' && (
                <button
                  onClick={() => handleStart(selectedTask.id)}
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20"
                >
                  ابدأ المهمة
                </button>
              )}
              {selectedTask.status === 'in_progress' && (
                <button
                  onClick={() => handleComplete(selectedTask.id)}
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  إكمال المهمة
                </button>
              )}
              <button
                onClick={() => setSelectedTask(null)}
                className="py-3 px-5 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
