'use client'

import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Play,
  HeartHandshake,
  X,
  User,
  MapPin,
  Loader2,
} from 'lucide-react'
import { EMOTIONS, MENTAL_TIPS } from '@/lib/guide/mentalHealthContent'
import { fetchAdminUsers } from '@/components/admin/data/adminUsersService'
import type { AdminUserDto } from '@/schemas/adminUser'

export default function MentalHealthTab() {
  const [openTip, setOpenTip] = useState<number | null>(0)
  const [breathPhase, setBreathPhase] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)
  const [timerRefs, setTimerRefs] = useState<{
    interval: NodeJS.Timeout | null
    timeout: NodeJS.Timeout | null
  }>({ interval: null, timeout: null })

  // Volunteer Directory states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [volunteers, setVolunteers] = useState<AdminUserDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const PHASES = ['شهيق', 'استقرار', 'زفير']

  const stopBreathing = () => {
    if (timerRefs.interval) clearInterval(timerRefs.interval)
    if (timerRefs.timeout) clearTimeout(timerRefs.timeout)
    setIsBreathing(false)
    setBreathPhase(0)
  }

  const toggleBreathing = () => {
    if (isBreathing) {
      stopBreathing()
      return
    }

    setIsBreathing(true)
    setBreathPhase(0)
    let phase = 0
    const interval = setInterval(() => {
      phase = (phase + 1) % 3
      setBreathPhase(phase)
    }, 4000)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setIsBreathing(false)
      setBreathPhase(0)
    }, 48000)

    setTimerRefs({ interval, timeout })
  }

  const handleFetchVolunteers = async () => {
    setIsModalOpen(true)
    setLoading(true)
    setError(null)
    try {
      const res = await fetchAdminUsers({ role: 'volunteer', pageSize: 100 })
      setVolunteers(res.users ?? [])
    } catch (err) {
      console.error(err)
      setError('تعذر تحميل المتطوعين. يرجى التحقق من الاتصال بالشبكة.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6" style={{ direction: 'rtl' }}>
      <div className="text-right mb-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
          الدعم النفسي – أنت لست وحدك
        </h2>
        <p className="text-black text-[14px] sm:text-[16px] font-black leading-relaxed max-w-xl">
          ما تمر به طبيعي. الحرب مصيبة ومشاعرك صحيحة جداً. نحن هنا لمناجاتك بكل
          خطوة.
        </p>
      </div>

      <div>
        <h3 className="text-[17px] sm:text-[19px] font-black text-slate-800 mb-4">
          تعرف على مشاعرك
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {EMOTIONS.map((e, i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 min-h-[150px] flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
            >
              <span className="text-4xl drop-shadow-[0_0_12px_rgba(250,204,21,0.4)] transition-transform duration-300 group-hover:scale-110">
                {e.emoji}
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="font-black text-slate-800 text-[15px] group-hover:text-[#2196F3] transition-colors">
                  {e.label}
                </span>
                <p className="text-black text-[13px] sm:text-[14px] font-bold leading-relaxed">
                  {e.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-[24px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-lg"
        style={{ background: 'linear-gradient(90deg, #2196F3 0%, #176BAD 100%)' }}
      >
        <div className="flex flex-col text-right text-white gap-4 flex-1">
          <h3 className="text-[22px] sm:text-[28px] font-black">
            مركز التمارين: تنفس بهدوء
          </h3>
          <p className="text-white/95 text-[15px] sm:text-[17px] font-bold leading-relaxed max-w-lg">
            تمرين التنفس المربع يساعد على تهدئة الجهاز العصبي فوراً. اتبع
            الدائرة المرئية ووازن نبضات قلبك.
          </p>
          <div className="flex gap-4 flex-wrap mt-2 justify-start">
            <button
              type="button"
              className="border border-white/40 bg-white/10 text-white font-black text-[14px] px-8 py-3 rounded-full hover:bg-white/20 transition-all"
            >
              تمارين أخرى
            </button>
            <button
              type="button"
              onClick={toggleBreathing}
              className="bg-white text-[#2196F3] font-black text-[14px] px-8 py-3 rounded-full hover:bg-blue-50 transition-all shadow-md flex items-center gap-2"
            >
              {isBreathing ? 'جارٍ التمرين...' : 'ابدأ التمرين'}
              {!isBreathing && <Play size={16} fill="currentColor" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 flex-shrink-0 ml-0 md:ml-10">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border-[1px] border-white/30 transition-all duration-[4000ms] ${isBreathing && breathPhase === 0 ? 'scale-110' : isBreathing && breathPhase === 2 ? 'scale-90' : 'scale-100'}`}
            />
            <div
              className={`absolute inset-4 rounded-full border-[3px] border-white/40 transition-all duration-[4000ms] delay-75 ${isBreathing && breathPhase === 0 ? 'scale-110' : isBreathing && breathPhase === 2 ? 'scale-90' : 'scale-100'}`}
            />
            <div
              className={`absolute inset-8 rounded-full border-[5px] border-white/50 transition-all duration-[4000ms] delay-150 ${isBreathing && breathPhase === 0 ? 'scale-110' : isBreathing && breathPhase === 2 ? 'scale-90' : 'scale-100'}`}
            />
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center z-10 shadow-xl transition-all duration-1000 ${!isBreathing ? 'animate-pulse' : ''}`}
            >
              <span className="text-[#2196F3] font-black text-[18px] sm:text-[22px]">
                {isBreathing ? PHASES[breathPhase] : 'شهيق'}
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-4 text-white/90 text-[11px] font-bold mt-2"
            style={{ direction: 'ltr' }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${breathPhase === 0 ? 'bg-white' : 'bg-white/40'}`}
              />
              <span>4 ثوانٍ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${breathPhase === 1 ? 'bg-white' : 'bg-white/40'}`}
              />
              <span>استقرار</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${breathPhase === 2 ? 'bg-white' : 'bg-white/40'}`}
              />
              <span>4 ثوانٍ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-[18px] sm:text-[20px] font-black text-slate-800">
            نصائح يومية للتوازن
          </h3>
          <div className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-3 h-full">
            {MENTAL_TIPS.map((tip, i) => (
              <div
                key={i}
                className="border-b border-slate-50 last:border-0 pb-3 last:pb-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenTip(openTip === i ? null : i)}
                  className="w-full flex items-center justify-between text-right py-1"
                >
                  <span className="font-black text-slate-800 text-[14px]">
                    {tip.title}
                  </span>
                  {openTip === i ? (
                    <ChevronUp
                      size={16}
                      className="text-[#2196F3] flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-slate-400 flex-shrink-0"
                    />
                  )}
                </button>
                {openTip === i && (
                  <p className="text-black text-[14px] sm:text-[15px] font-black leading-relaxed mt-2 pr-1">
                    {tip.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[18px] sm:text-[20px] font-black text-slate-800">
            قصص أمل
          </h3>
          <div className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4 h-full">
            <blockquote className="text-slate-800 text-[14px] sm:text-[16px] font-bold leading-relaxed text-right not-italic border-r-4 border-[#2196F3] pr-4">
              &quot;في أصعب اللحظات، وجدت أن مساعدة جاري كانت في داخلي الحقيقي.
              الغذاء ربما قد خسرته، رغم ما في جوانبها.&quot;
            </blockquote>
            <div className="flex items-center gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-[#2196F3]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#2196F3] text-lg">👤</span>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-800 text-[14px]">أبو سليم</p>
                <p className="text-slate-500 text-[12px] font-bold">
                  ناجٍ ومتطوع مجتمعي
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-[16px] border-[2px] border-[#2196F3] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ background: 'rgba(33, 150, 243, 0.15)' }}
      >
        <div className="text-right flex-1">
          <p className="font-black text-slate-900 text-[16px] sm:text-[18px] mb-1">
            هل تحتاج لمساعدة فورية؟
          </p>
          <p className="text-slate-600 text-[13px] sm:text-[14px] font-bold">
            متطوعونا والمتخصصون متاحون 24/7 للاستماع إليك.
          </p>
        </div>

        <div className="flex gap-8 justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Phone size={20} className="text-[#2196F3]" />
            </div>
            <span
              className="font-bold text-slate-500 text-[12px] sm:text-[13px]"
              style={{ direction: 'ltr' }}
            >
              1800-555-000
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <HeartHandshake size={20} className="text-[#2196F3]" />
            </div>
            <span
              className="font-bold text-slate-500 text-[12px] sm:text-[13px]"
              style={{ direction: 'ltr' }}
            >
              1800-555-111
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-end w-full md:w-auto">
          <button
            type="button"
            onClick={handleFetchVolunteers}
            className="bg-[#2196F3] text-white font-black text-[14px] px-8 py-3.5 rounded-2xl hover:bg-blue-600 transition-all shadow-md w-full md:w-auto cursor-pointer"
          >
            تحدث مع متطوع الآن
          </button>
        </div>
      </div>

      {/* Custom Volunteer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          {/* Backdrop click close */}
          <div className="absolute inset-0 cursor-default" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-[24px] border border-slate-100 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-start gap-4 text-right">
              <div className="flex-1">
                <h3 className="text-[18px] font-black text-slate-900">
                  المتطوعون المتاحون الآن
                </h3>
                <p className="text-[13px] text-slate-500 font-bold mt-1">
                  متطوعونا جاهزون للاستماع إليك وتقديم الدعم الإرشادي والنفسي
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-500">
                  <Loader2 className="animate-spin text-[#2196F3]" size={32} />
                  <span className="font-bold text-[14px]">جاري تحميل قائمة المتطوعين...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <p className="text-red-500 text-[14px] font-bold">{error}</p>
                  <button
                    onClick={handleFetchVolunteers}
                    className="px-4 py-2 bg-[#2196F3] text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all cursor-pointer"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : volunteers.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-bold text-[14px]">
                  لا يوجد متطوعون متاحون حالياً.
                </div>
              ) : (
                <div className="flex flex-col gap-3 font-cairo">
                  {volunteers.map((vol) => (
                    <div
                      key={vol.id}
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-[#2196F3]/5 border border-slate-100 rounded-[20px] transition-all"
                    >
                      {/* Right side: Avatar and Info */}
                      <div className="flex items-center gap-3 text-right">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-full bg-[#2196F3]/10 flex items-center justify-center text-slate-600 font-bold">
                            <User size={20} className="text-[#2196F3]" />
                          </div>
                          {/* Status Dot */}
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-slate-800 text-[14px]">
                            {vol.name || vol.fullName}
                          </span>
                          <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1">
                            <MapPin size={12} className="text-[#2196F3]" />
                            {vol.region || 'المنطقة الشمالية'}
                          </span>
                        </div>
                      </div>

                      {/* Left side: Call Action */}
                      {vol.phoneNumber ? (
                        <a
                          href={`tel:${vol.phoneNumber}`}
                          className="flex items-center gap-1.5 bg-[#22C55E] hover:bg-green-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                          style={{ direction: 'ltr' }}
                        >
                          <Phone size={12} />
                          <span>{vol.phoneNumber}</span>
                        </a>
                      ) : (
                        <span className="text-[12px] text-slate-400 font-bold">لا يوجد رقم هاتف</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs rounded-xl transition-all cursor-pointer"
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
