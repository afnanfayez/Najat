'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  UserCheck,
  Calendar,
  Phone,
  Navigation,
  Star,
  TrendingUp,
  Award,
  Users,
  ChevronLeft,
} from 'lucide-react'
import ProfileAvatar from '@/components/profile/shared/ProfileAvatar'

// ─── Types ──────────────────────────────────────────────────────────────────

interface AssignedTask {
  id: string
  type: 'aid-delivery' | 'medical-escort' | 'area-survey' | 'emergency-response'
  title: string
  location: string
  time: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'done'
}

// ─── Static demo data ────────────────────────────────────────────────────────

const DEMO_TASKS: AssignedTask[] = [
  {
    id: '1',
    type: 'aid-delivery',
    title: 'توزيع طرود غذائية',
    location: 'حي الزيتون — غزة',
    time: 'اليوم، 3:00 م',
    priority: 'high',
    status: 'pending',
  },
  {
    id: '2',
    type: 'medical-escort',
    title: 'مرافقة مريض إلى مستشفى الشفاء',
    location: 'الرمال، غزة',
    time: 'اليوم، 5:30 م',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: '3',
    type: 'area-survey',
    title: 'مسح ميداني — شمال القطاع',
    location: 'بيت حانون',
    time: 'غداً، 9:00 ص',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: '4',
    type: 'emergency-response',
    title: 'دعم فريق الاستجابة الطارئة',
    location: 'مخيم جباليا',
    time: 'غداً، 2:00 م',
    priority: 'high',
    status: 'pending',
  },
]

const PRIORITY_STYLES = {
  high: { label: 'عاجل', bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
  medium: { label: 'متوسط', bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
  low: { label: 'عادي', bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
}

const STATUS_STYLES = {
  pending: { label: 'قيد الانتظار', bg: 'bg-slate-100', text: 'text-slate-600' },
  'in-progress': { label: 'جارٍ التنفيذ', bg: 'bg-blue-100', text: 'text-blue-600' },
  done: { label: 'مكتمل', bg: 'bg-green-100', text: 'text-green-600' },
}

const TASK_ICONS: Record<AssignedTask['type'], React.ReactNode> = {
  'aid-delivery': <Truck size={20} />,
  'medical-escort': <Heart size={20} />,
  'area-survey': <Navigation size={20} />,
  'emergency-response': <AlertTriangle size={20} />,
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '1a', color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-semibold">{label}</p>
      </div>
    </div>
  )
}

function TaskCard({
  task,
  onStart,
  onComplete,
}: {
  task: AssignedTask
  onStart: (id: string) => void
  onComplete: (id: string) => void
}) {
  const priority = PRIORITY_STYLES[task.priority]
  const status = STATUS_STYLES[task.status]

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-500"
          >
            {TASK_ICONS[task.type]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-800 text-sm leading-tight truncate">
              {task.title}
            </span>
            <span className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
              <MapPin size={11} />
              {task.location}
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${priority.bg} ${priority.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
      </div>

      {/* Time + Status */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 font-semibold">
          <Clock size={12} />
          {task.time}
        </span>
        <span className={`px-2 py-0.5 rounded-full font-bold ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Actions */}
      {task.status !== 'done' && (
        <div className="flex gap-2 pt-1 border-t border-slate-50">
          {task.status === 'pending' && (
            <button
              onClick={() => onStart(task.id)}
              className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck size={13} />
              ابدأ المهمة
            </button>
          )}
          {task.status === 'in-progress' && (
            <button
              onClick={() => onComplete(task.id)}
              className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 size={13} />
              إنهاء المهمة
            </button>
          )}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <MapPin size={13} />
            الموقع
          </a>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VolunteerDashboardContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<AssignedTask[]>(DEMO_TASKS)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'done'>('all')

  const completedCount = tasks.filter((t) => t.status === 'done').length
  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length
  const totalHours = 47 // static demo value

  const filteredTasks =
    activeTab === 'all' ? tasks : tasks.filter((t) => t.status === activeTab)

  const handleStart = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'in-progress' } : t)),
    )
  }

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)),
    )
  }

  const todayTasks = tasks.filter(
    (t) => t.time.startsWith('اليوم') && t.status !== 'done',
  )

  return (
    <div className="w-full flex flex-col gap-6 pb-10" dir="rtl">
      {/* ── Hero Card ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1565C0] to-[#1976D2] text-white p-6 shadow-lg">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <ProfileAvatar
            src={user?.avatarUrl}
            size={72}
            borderClassName="border-4 border-white/30"
          />
          <div className="flex flex-col text-center sm:text-right">
            <p className="text-blue-200 text-sm font-semibold">لوحة المتطوع</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">
              {isLoading ? '...' : (user?.fullName ?? 'متطوع نجاة')}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
              <span className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 text-xs font-bold">
                <Award size={12} />
                متطوع نشط
              </span>
              {user?.region && (
                <span className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 text-xs font-bold">
                  <MapPin size={12} />
                  {user.region}
                </span>
              )}
            </div>
          </div>
          <div className="sm:mr-auto flex flex-col items-center sm:items-end gap-1">
            <div className="flex items-center gap-1 bg-yellow-400/20 rounded-full px-3 py-1">
              <Star size={14} className="text-yellow-300 fill-yellow-300" />
              <span className="text-sm font-extrabold text-yellow-200">4.9</span>
            </div>
            <span className="text-xs text-blue-200 font-semibold">تقييم الأداء</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/20">
          <div className="text-center">
            <p className="text-2xl font-extrabold">{completedCount + 18}</p>
            <p className="text-xs text-blue-200 font-semibold">مهام مكتملة</p>
          </div>
          <div className="text-center border-x border-white/20">
            <p className="text-2xl font-extrabold">{totalHours}</p>
            <p className="text-xs text-blue-200 font-semibold">ساعة تطوع</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold">12</p>
            <p className="text-xs text-blue-200 font-semibold">أسرة مدعومة</p>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Clock size={22} />} label="مهام قيد الانتظار" value={pendingCount} color="#F59E0B" />
        <StatCard icon={<TrendingUp size={22} />} label="جارٍ تنفيذها" value={inProgressCount} color="#3B82F6" />
        <StatCard icon={<CheckCircle2 size={22} />} label="مكتملة اليوم" value={completedCount} color="#10B981" />
        <StatCard icon={<Users size={22} />} label="المجموع الكلي" value={tasks.length + 18} color="#8B5CF6" />
      </div>

      {/* ── Today's Urgent Tasks ── */}
      {todayTasks.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="text-base font-extrabold text-red-700">مهام اليوم العاجلة</h2>
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 mr-auto">
              {todayTasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-red-100 shadow-sm"
              >
                <div className="w-9 h-9 bg-red-100 text-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {TASK_ICONS[task.type]}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-bold text-slate-800 text-sm truncate">{task.title}</span>
                  <span className="text-slate-500 text-xs">{task.time} · {task.location}</span>
                </div>
                {task.status === 'pending' && (
                  <button
                    onClick={() => handleStart(task.id)}
                    className="shrink-0 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ابدأ
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="shrink-0 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    أنهِ
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── All Tasks ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="text-base font-extrabold text-slate-800">جميع المهام</h2>
          <span className="text-xs text-slate-400 font-semibold">{tasks.length} مهمة</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 pb-0">
          {(['all', 'pending', 'in-progress', 'done'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab === 'all'
                ? 'الكل'
                : tab === 'pending'
                ? 'منتظرة'
                : tab === 'in-progress'
                ? 'جارية'
                : 'مكتملة'}
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-col gap-3">
          {filteredTasks.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold text-sm">
              لا توجد مهام في هذا التصنيف
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={handleStart}
                onComplete={handleComplete}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/profile')}
          className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-right"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">جدول المواعيد</span>
            <span className="text-xs text-slate-500 mt-0.5">عرض المهام المجدولة للأسبوع</span>
          </div>
          <ChevronLeft size={16} className="text-slate-300 mr-auto" />
        </button>

        <a
          href="tel:101"
          className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-right"
        >
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Phone size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">خط الطوارئ المباشر</span>
            <span className="text-xs text-slate-500 mt-0.5">التواصل مع مركز العمليات</span>
          </div>
          <ChevronLeft size={16} className="text-slate-300 mr-auto" />
        </a>
      </div>
    </div>
  )
}
