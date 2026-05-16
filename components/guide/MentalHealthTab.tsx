'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Phone, MessageCircle, Play, HeartHandshake } from 'lucide-react'
import { EMOTIONS, MENTAL_TIPS } from '@/data/healthGuideData'

export default function MentalHealthTab() {
  const [openTip, setOpenTip] = useState<number | null>(0)
  const [breathPhase, setBreathPhase] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)

  const [timerRefs, setTimerRefs] = useState<{ interval: NodeJS.Timeout | null, timeout: NodeJS.Timeout | null }>({ interval: null, timeout: null })

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

  return (
    <div className="flex flex-col gap-6" style={{ direction: 'rtl' }}>

      {/* Hero */}
      <div className="text-right mb-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">الدعم النفسي – أنت لست وحدك</h2>
        <p className="text-black text-[14px] sm:text-[16px] font-black leading-relaxed max-w-xl">
          ما تمر به طبيعي. الحرب مصيبة ومشاعرك صحيحة جداً. نحن هنا لمناجاتك بكل خطوة.
        </p>
      </div>

      {/* Emotions */}
      <div>
        <h3 className="text-[17px] sm:text-[19px] font-black text-slate-800 mb-4">تعرف على مشاعرك</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {EMOTIONS.map((e, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 min-h-[150px] flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
              <span className="text-4xl drop-shadow-[0_0_12px_rgba(250,204,21,0.4)] transition-transform duration-300 group-hover:scale-110">{e.emoji}</span>
              <div className="flex flex-col gap-1.5">
                <span className="font-black text-slate-800 text-[15px] group-hover:text-[#2196F3] transition-colors">{e.label}</span>
                <p className="text-black text-[13px] sm:text-[14px] font-bold leading-relaxed">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breathing Exercise */}
      <div className="rounded-[24px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-lg" style={{ background: 'linear-gradient(90deg, #2196F3 0%, #176BAD 100%)' }}>
        {/* Right Content */}
        <div className="flex flex-col text-right text-white gap-4 flex-1">
          <h3 className="text-[22px] sm:text-[28px] font-black">مركز التمارين: تنفس بهدوء</h3>
          <p className="text-white/95 text-[15px] sm:text-[17px] font-bold leading-relaxed max-w-lg">
            تمرين التنفس المربع يساعد على تهدئة الجهاز العصبي فوراً. اتبع الدائرة المرئية ووازن نبضات قلبك.
          </p>
          <div className="flex gap-4 flex-wrap mt-2 justify-start">
            <button className="border border-white/40 bg-white/10 text-white font-black text-[14px] px-8 py-3 rounded-full hover:bg-white/20 transition-all">
              تمارين أخرى
            </button>
            <button onClick={toggleBreathing}
              className="bg-white text-[#2196F3] font-black text-[14px] px-8 py-3 rounded-full hover:bg-blue-50 transition-all shadow-md flex items-center gap-2">
              {isBreathing ? 'جارٍ التمرين...' : 'ابدأ التمرين'}
              {!isBreathing && <Play size={16} fill="currentColor" />}
            </button>
          </div>
        </div>

        {/* Left Content (Circle) */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0 ml-0 md:ml-10">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* Outer circles */}
            <div className={`absolute inset-0 rounded-full border-[1px] border-white/30 transition-all duration-[4000ms] ${isBreathing && breathPhase === 0 ? 'scale-110' : isBreathing && breathPhase === 2 ? 'scale-90' : 'scale-100'}`} />
            <div className={`absolute inset-4 rounded-full border-[3px] border-white/40 transition-all duration-[4000ms] delay-75 ${isBreathing && breathPhase === 0 ? 'scale-110' : isBreathing && breathPhase === 2 ? 'scale-90' : 'scale-100'}`} />
            <div className={`absolute inset-8 rounded-full border-[5px] border-white/50 transition-all duration-[4000ms] delay-150 ${isBreathing && breathPhase === 0 ? 'scale-110' : isBreathing && breathPhase === 2 ? 'scale-90' : 'scale-100'}`} />
            
            {/* Inner White Circle */}
            <div className={`w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center z-10 shadow-xl transition-all duration-1000 ${!isBreathing ? 'animate-pulse' : ''}`}>
              <span className="text-[#2196F3] font-black text-[18px] sm:text-[22px]">
                {isBreathing ? PHASES[breathPhase] : 'شهيق'}
              </span>
            </div>
          </div>
          
          {/* Dots below circle */}
          <div className="flex items-center gap-4 text-white/90 text-[11px] font-bold mt-2" style={{ direction: 'ltr' }}>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${breathPhase === 0 ? 'bg-white' : 'bg-white/40'}`} />
              <span>4 ثوانٍ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${breathPhase === 1 ? 'bg-white' : 'bg-white/40'}`} />
              <span>استقرار</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${breathPhase === 2 ? 'bg-white' : 'bg-white/40'}`} />
              <span>4 ثوانٍ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips + Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-2">
        {/* Accordion Tips */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[18px] sm:text-[20px] font-black text-slate-800">نصائح يومية للتوازن</h3>
          <div className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col gap-3 h-full">
            {MENTAL_TIPS.map((tip, i) => (
              <div key={i} className="border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                <button onClick={() => setOpenTip(openTip === i ? null : i)}
                  className="w-full flex items-center justify-between text-right py-1">
                  <span className="font-black text-slate-800 text-[14px]">{tip.title}</span>
                  {openTip === i ? <ChevronUp size={16} className="text-[#2196F3] flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                </button>
                {openTip === i && (
                  <p className="text-black text-[14px] sm:text-[15px] font-black leading-relaxed mt-2 pr-1">{tip.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[18px] sm:text-[20px] font-black text-slate-800">قصص أمل</h3>
          <div className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4 h-full">
            <blockquote className="text-slate-800 text-[14px] sm:text-[16px] font-bold leading-relaxed text-right not-italic border-r-4 border-[#2196F3] pr-4">
              "في أصعب اللحظات، وجدت أن مساعدة جاري كانت في داخلي الحقيقي. الغذاء ربما قد خسرته، رغم ما في جوانبها."
            </blockquote>
            <div className="flex items-center gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-[#2196F3]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#2196F3] text-lg">👤</span>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-800 text-[14px]">أبو سليم</p>
                <p className="text-slate-500 text-[12px] font-bold">ناجٍ ومتطوع مجتمعي</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Bar */}
      <div className="rounded-[16px] border-[2px] border-[#2196F3] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'rgba(33, 150, 243, 0.15)' }}>
        
        {/* Right side texts */}
        <div className="text-right flex-1">
          <p className="font-black text-slate-900 text-[16px] sm:text-[18px] mb-1">هل تحتاج لمساعدة فورية؟</p>
          <p className="text-slate-600 text-[13px] sm:text-[14px] font-bold">متطوعونا والمتخصصون متاحون 24/7 للاستماع إليك.</p>
        </div>

        {/* Middle icons and numbers */}
        <div className="flex gap-8 justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Phone size={20} className="text-[#2196F3]" />
            </div>
            <span className="font-bold text-slate-500 text-[12px] sm:text-[13px]" style={{ direction: 'ltr' }}>1800-555-000</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <HeartHandshake size={20} className="text-[#2196F3]" />
            </div>
            <span className="font-bold text-slate-500 text-[12px] sm:text-[13px]" style={{ direction: 'ltr' }}>1800-555-111</span>
          </div>
        </div>

        {/* Left side button */}
        <div className="flex-1 flex justify-end w-full md:w-auto">
          <button className="bg-[#2196F3] text-white font-black text-[14px] px-8 py-3.5 rounded-2xl hover:bg-blue-600 transition-all shadow-md w-full md:w-auto">
            تحدث مع متطوع الآن
          </button>
        </div>
      </div>
    </div>
  )
}
