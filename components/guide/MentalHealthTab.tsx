'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Phone, MessageCircle } from 'lucide-react'

const EMOTIONS = [
  { emoji: '😨', label: 'الخوف', desc: 'من الطبيعي الشعور بالخوف. دعك من الجروح. حاول أن تكون في مكان آمن الآن.' },
  { emoji: '😢', label: 'الحزن', desc: 'البكاء يعبر عن ألم حقيقي. دعها تنهمر حتى تشعر ببعض الراحة.' },
  { emoji: '😡', label: 'الغضب', desc: 'الغضب والظلم شعور طبيعي. تنفس ببطء وحاول وصف ما تشعر به.' },
  { emoji: '😮', label: 'الصدمة', desc: 'بعد الصدمة قد تشعر بتخدر. خذ وقتك دون ضغط لتتعافى.' },
]

const TIPS = [
  {
    title: 'تقليل استهلاك الأخبار',
    desc: 'خصص 15 دقيقة فقط لمتابعة المستجدات. التعرض المستمر للأخبار القلقة يزيد من مستويات التوتر المرضي.',
  },
  {
    title: 'الروتين اليومي البسيط',
    desc: 'حاول الالتزام بأوقات نوم وصحيان ووجبات ثابتة. الروتين يعطي الشعور بالاستقرار في أوقات الأزمات.',
  },
  {
    title: 'التواصل الاجتماعي الداعم',
    desc: 'تحدث مع شخص تثق به. مشاركة مشاعرك تخفف العبء النفسي وتساعد على الشعور بالانتماء.',
  },
]

const BREATHING_PHASES = ['شهيق', 'احتفظ', 'زفير']

export default function MentalHealthTab() {
  const [openTip, setOpenTip] = useState<number | null>(0)
  const [breathPhase, setBreathPhase] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)

  const startBreathing = () => {
    setIsBreathing(true)
    let phase = 0
    const interval = setInterval(() => {
      phase = (phase + 1) % 3
      setBreathPhase(phase)
    }, 4000)
    setTimeout(() => {
      clearInterval(interval)
      setIsBreathing(false)
      setBreathPhase(0)
    }, 48000)
  }

  return (
    <div className="flex flex-col gap-6" style={{ direction: 'rtl' }}>

      {/* Hero Banner */}
      <div className="bg-gradient-to-l from-[#1565C0] to-[#2196F3] rounded-[28px] p-6 sm:p-8 text-right text-white shadow-lg">
        <h2 className="text-xl sm:text-2xl font-black mb-2">الدعم النفسي – أنت لست وحدك</h2>
        <p className="text-white/85 text-[13px] sm:text-[15px] font-bold leading-relaxed max-w-xl">
          ما تمر به طبيعي. الحرب مصيبة ومشاعرك صحيحة جداً. نحن هنا لمناجاتك بكل خطوة.
        </p>
      </div>

      {/* Emotions Grid */}
      <div>
        <h3 className="text-[17px] sm:text-[19px] font-black text-slate-800 mb-4 text-right">تعرف على مشاعرك</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {EMOTIONS.map((e, i) => (
            <div key={i} className="bg-white rounded-[20px] border border-slate-100 p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
              <span className="text-3xl">{e.emoji}</span>
              <span className="font-black text-slate-800 text-[14px] group-hover:text-[#2196F3] transition-colors">{e.label}</span>
              <p className="text-slate-500 text-[11px] font-bold leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Breathing Exercise */}
      <div className="bg-gradient-to-l from-[#1565C0] to-[#2196F3] rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-lg">
        {/* Animated circle */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/50 bg-white/20 flex items-center justify-center transition-all duration-[4000ms] ${
              isBreathing && breathPhase === 0 ? 'scale-125 bg-white/30' : isBreathing && breathPhase === 2 ? 'scale-90 bg-white/10' : 'scale-100'
            }`}
          >
            <span className="text-white font-black text-[18px]">{isBreathing ? BREATHING_PHASES[breathPhase] : 'ابدأ'}</span>
          </div>
          {isBreathing && (
            <div className="flex gap-2 mt-1">
              {[0, 1, 2].map(p => (
                <span key={p} className={`w-2 h-2 rounded-full ${breathPhase === p ? 'bg-white' : 'bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Text + Buttons */}
        <div className="flex flex-col text-right text-white gap-3 flex-1">
          <h3 className="text-[18px] sm:text-[22px] font-black">مركز التمارين: تنفس بهدوء</h3>
          <p className="text-white/85 text-[13px] sm:text-[15px] font-bold leading-relaxed">
            تمرين التنفس المربع يساعد على تهدئة الجهاز العصبي فوراً. اتبع الدائرة المرئية وتنفس بإيقاعها.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={startBreathing}
              disabled={isBreathing}
              className="bg-white text-[#2196F3] font-black text-[13px] px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md disabled:opacity-60"
            >
              {isBreathing ? 'جارٍ التمرين...' : 'ابدأ التمرين'}
            </button>
            <button className="border border-white/50 text-white font-black text-[13px] px-6 py-2.5 rounded-xl hover:bg-white/10 transition-all">
              تمارين أخرى
            </button>
          </div>
        </div>
      </div>

      {/* Tips + Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* Daily Tips Accordion */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-3">
          <h3 className="text-[16px] sm:text-[18px] font-black text-slate-800 mb-1">نصائح يومية للتوازن</h3>
          {TIPS.map((tip, i) => (
            <div key={i} className="border-b border-slate-50 last:border-0 pb-3 last:pb-0">
              <button
                onClick={() => setOpenTip(openTip === i ? null : i)}
                className="w-full flex items-center justify-between text-right py-1"
              >
                <span className="font-black text-slate-800 text-[14px]">{tip.title}</span>
                {openTip === i ? <ChevronUp size={16} className="text-[#2196F3] flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
              </button>
              {openTip === i && (
                <p className="text-slate-500 text-[12px] sm:text-[13px] font-bold leading-relaxed mt-2 pr-1">
                  {tip.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Story of Hope */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4">
          <h3 className="text-[16px] sm:text-[18px] font-black text-slate-800">قصص أمل</h3>
          <blockquote className="text-slate-700 text-[13px] sm:text-[15px] font-bold leading-relaxed text-right italic border-r-4 border-[#2196F3] pr-4">
            "في أصعب اللحظات، وجدت أن مساعدة جاري كانت في داخلي الحقيقي. الغذاء ربما قد خسرته، رغم ما في جوانبها."
          </blockquote>
          <div className="flex items-center gap-3 justify-end">
            <div className="text-right">
              <p className="font-black text-slate-800 text-[13px]">أبو سليم</p>
              <p className="text-slate-400 text-[11px] font-bold">ناجٍ ومتطوع مجتمعي</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2196F3]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#2196F3] text-lg">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Bar */}
      <div className="bg-gradient-to-l from-[#1565C0] to-[#2196F3] rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <button className="bg-white text-[#2196F3] font-black text-[13px] px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
          <MessageCircle size={16} />
          تحدث مع متطوع الآن
        </button>

        <div className="flex gap-6 text-white text-center">
          <div className="flex flex-col items-center gap-1">
            <Phone size={18} className="text-white/80" />
            <span className="font-black text-[13px]">1800-555-000</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Phone size={18} className="text-white/80" />
            <span className="font-black text-[13px]">1800-555-111</span>
          </div>
        </div>

        <div className="text-right text-white">
          <p className="font-black text-[15px]">هل تحتاج لمساعدة فورية؟</p>
          <p className="text-white/80 text-[12px] font-bold">متطوعون ومتخصصون متاحون 24/7 للاستماع إليك.</p>
        </div>
      </div>

    </div>
  )
}
