'use client'

import React from 'react'
import { ArrowRight, Phone, MapPin, Clock, Stethoscope, Pill, AlertCircle, ChevronLeft, TriangleAlert, Activity, Map, Baby, Eye, Monitor, Droplets, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

interface HospitalDetailViewProps {
  hospital: any
  onBack: () => void
  onShowMap: () => void
  onShowAllDoctors: () => void
}

export default function HospitalDetailView({ hospital, onBack, onShowMap, onShowAllDoctors }: HospitalDetailViewProps) {
  return (
    <div
      className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-10"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Hero header ── */
        .hdv-hero { height: 480px; border-radius: 32px; }
        @media (max-width: 768px) { .hdv-hero { height: 320px; border-radius: 20px; } }

        /* ── Hero title ── */
        .hdv-title { font-size: 3.75rem; }
        @media (max-width: 768px) { .hdv-title { font-size: 1.5rem; } }

        /* ── Hero address text ── */
        .hdv-address { font-size: 1.25rem; }
        @media (max-width: 768px) { .hdv-address { font-size: 0.8rem; } }

        /* ── Bottom-right content block ── */
        .hdv-hero-content { bottom: 2.5rem; right: 2.5rem; gap: 1rem; }
        @media (max-width: 768px) { .hdv-hero-content { bottom: 4.5rem; right: 1rem; gap: 0.5rem; } }

        /* ── Bottom-left buttons block ── */
        .hdv-hero-btns { bottom: 2.5rem; left: 2.5rem; gap: 1rem; }
        @media (max-width: 768px) { .hdv-hero-btns { bottom: 1rem; right: 1rem; left: 1rem; gap: 0.5rem; justify-content: flex-start; flex-wrap: wrap; } }

        /* ── Hero badges ── */
        .hdv-badge { padding: 8px 20px; font-size: 13px; }
        @media (max-width: 768px) { .hdv-badge { padding: 4px 10px; font-size: 10px; } }

        /* ── Hero action buttons ── */
        .hdv-btn { padding: 10px 24px; font-size: 13px; height: 44px; }
        @media (max-width: 768px) { .hdv-btn { padding: 6px 12px; font-size: 11px; height: 34px; } }

        /* ── Middle 2-col grid ── */
        .hdv-mid-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 24px; margin-top: 16px; }
        @media (max-width: 900px) { .hdv-mid-grid { display: flex; flex-direction: column; gap: 24px; } }

        /* ── Services & Location card height & order ── */
        .hdv-services-card { height: 300px; order: 1; }
        .hdv-location-card { height: 300px; order: 2; }
        @media (max-width: 900px) { 
          .hdv-services-card { height: auto; min-height: 280px; order: 2; } 
          .hdv-location-card { height: auto; min-height: 280px; order: 1; } 
        }

        /* ── Services inner scrolling ── */
        .hdv-services-inner { overflow-y: auto; padding-bottom: 8px; }
        @media (max-width: 900px) { .hdv-services-inner { overflow-y: visible; padding-bottom: 0; } }

        /* ── Doctors section padding ── */
        .hdv-doctors-wrap { padding: 32px; margin-top: 24px; }
        @media (max-width: 768px) { .hdv-doctors-wrap { padding: 16px; margin-top: 16px; border-radius: 20px !important; } }

        /* ── Doctors grid ── */
        .hdv-doctors-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; }
        @media (max-width: 900px) { .hdv-doctors-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .hdv-doctors-grid { grid-template-columns: repeat(1, 1fr); } }

        /* ── Bottom 2-col grid ── */
        .hdv-bottom-grid { display: grid; grid-template-columns: 8fr 4fr; gap: 24px; margin-top: 24px; }
        @media (max-width: 900px) { .hdv-bottom-grid { grid-template-columns: 1fr; } }

        /* ── Footer card buttons ── */
        .hdv-footer-btns { flex-direction: row; gap: 12px; }
        @media (max-width: 480px) { .hdv-footer-btns { flex-direction: column; width: 100%; } }
        @media (max-width: 480px) { .hdv-footer-btns button { width: 100%; justify-content: center; } }

        /* ── Footer layout ── */
        .hdv-footer-inner { flex-direction: row; }
        @media (max-width: 768px) { .hdv-footer-inner { flex-direction: column; gap: 16px; align-items: flex-start; } }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* ── Hero Image Header ── */}
      <div className="hdv-hero relative w-full overflow-hidden shadow-2xl flex-shrink-0">
        <Image src="/assets/health1.jpg" alt="Hospital Header" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Top-right: Simple back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            padding: '8px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <ArrowRight size={18} />
          <span>رجوع</span>
        </button>

        {/* Bottom-right: title + badges */}
        <div className="hdv-hero-content absolute flex flex-col items-start text-white text-right">
          <div className="flex flex-wrap items-center gap-2 mb-1 w-full">
            <div className="hdv-badge bg-amber-500 text-white rounded-full font-black flex items-center gap-2 shadow-lg">
              <TriangleAlert size={14} />
              قدرة استيعابية محدودة
            </div>
            <div className="hdv-badge bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-black shadow-lg">
              آخر تحديث منذ 15 دقيقة
            </div>
          </div>
          <h1 className="hdv-title font-black mb-1 drop-shadow-lg leading-tight">مستشفى شهداء الأقصى</h1>
          <div className="hdv-address flex items-center gap-2 font-bold drop-shadow-md">
            <MapPin size={20} className="text-white flex-shrink-0" />
            <span>غزة - الرمال - شارع الشهداء</span>
          </div>
        </div>

        {/* Bottom-left: action buttons */}
        <div className="hdv-hero-btns absolute flex items-center">
          <Button className="hdv-btn bg-white text-slate-800 hover:bg-slate-100 font-black rounded-2xl flex items-center gap-2 shadow-xl">
            <Phone size={16} className="text-blue-500" />
            اتصال
          </Button>
          <Button onClick={onShowMap} className="hdv-btn bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/30">
            <MapPin size={16} />
            عرض الخريطة
          </Button>
        </div>
      </div>

      {/* ── Middle: Location + Services ── */}
      <div className="hdv-mid-grid px-1">
        
        {/* Services */}
        <Card className="hdv-services-card p-5 rounded-[28px] border-2 border-slate-100 shadow-md bg-white flex flex-col">
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <Activity size={22} className="text-[#2196F3]" />
            <h3 className="text-lg font-black text-slate-800">الخدمات الطبية المتاحة</h3>
          </div>
          <div className="hdv-services-inner flex flex-wrap gap-2 sm:gap-3 justify-start no-scrollbar">
            {[
              { label: 'النساء والولادة', icon: Baby },
              { label: 'الأسنان', icon: Stethoscope },
              { label: 'العيون', icon: Eye },
              { label: 'العظام', icon: Activity },
              { label: 'التصوير التلفزيوني', icon: Monitor },
              { label: 'الجراحة العامة', icon: Pill },
              { label: 'المسالك البولية', icon: Droplets },
              { label: 'السكر والغدد', icon: Activity },
              { label: 'جراحة التجميل', icon: Sparkles },
              { label: 'الجلدية والعناية بالبشرة', icon: Heart },
            ].map((service, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 border-[#2196F3] bg-white shadow-sm hover:bg-blue-50 transition-all cursor-default">
                <service.icon size={16} className="text-[#F2A122] sm:w-[18px] sm:h-[18px]" />
                <span className="text-[12px] sm:text-[14px] font-black text-slate-700">{service.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Location */}
        <Card className="hdv-location-card p-5 rounded-[28px] border-2 border-slate-100 shadow-md bg-white flex flex-col">
          <div className="flex items-center gap-3 mb-3 flex-shrink-0">
            <Map size={22} className="text-[#2196F3]" />
            <h3 className="text-lg font-black text-slate-800">الموقع والاتصال</h3>
          </div>
          <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 shadow-inner border border-slate-100 flex-shrink-0">
            <Image src="/assets/health5.jpg" alt="Map Snippet" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-3 text-right">
            <div className="flex items-center gap-3 text-slate-700">
              <MapPin size={20} className="text-[#F2A122] flex-shrink-0" />
              <span className="font-black text-sm">غزة - الرمال - شارع الشهداء</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Phone size={20} className="text-[#F2A122] flex-shrink-0" />
              <span className="font-black text-sm">0595188009</span>
            </div>
          </div>
        </Card>

      </div>

      {/* ── Doctors Section ── */}
      <div
        className="hdv-doctors-wrap"
        style={{
          border: '2px solid #f1f5f9',
          borderRadius: '32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          background: '#fff',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="https://api.iconify.design/healthicons:doctor-male.svg?color=%232196f3" alt="doctor" style={{ width: '26px', height: '26px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Cairo', sans-serif" }}>الأطباء المناوبون الآن</h3>
          </div>
          <Button variant="ghost" className="text-[#2196F3] font-black flex items-center gap-1 hover:bg-blue-50 px-3 text-sm" onClick={onShowAllDoctors}>
            عرض الكل
            <ChevronLeft size={18} />
          </Button>
        </div>

        <div className="hdv-doctors-grid">
          {[
            { name: 'د. ناصر رأفت أبو شعبان',   specialty: 'استشاري الجراحة العامة وجراحة المناظير', photo: '/assets/doctor.png',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الخميس'] },
            { name: 'د. محمد صلاح اللولو',       specialty: 'أخصائي عيون',                            photo: '/assets/health6.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس'] },
            { name: 'د. سلامة سعيد التتر',        specialty: 'استشاري أمراض السكري والغدد',            photo: '/assets/health2.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس'] },
            { name: 'د. شادي عبد الحكيم الحداد',  specialty: 'أخصائي طب وجراحة الفم والأسنان',       photo: '/assets/Photo2.jpg',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الأربعاء'] },
          ].map((doctor, i) => (
            <div key={i} style={{ background: '#EAF6FD', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', textAlign: 'right', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '50%', overflow: 'hidden', background: '#fff', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
                  <img src={doctor.photo} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: '14px', color: '#1e293b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.4 }}>{doctor.name}</p>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', fontWeight: 600, color: '#64748b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.3 }}>{doctor.specialty}</p>
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', fontFamily: "'Cairo', sans-serif" }}>مواعيد العمل اسبوعيا</p>
                {doctor.days.map((day, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#334155', fontFamily: "'Cairo', sans-serif" }}>{day}</span>
                    <span dir="ltr" style={{ fontSize: '11px', fontWeight: 700, color: '#475569', fontFamily: "'Cairo', sans-serif" }}>{doctor.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom: Medicines + Hours ── */}
      <div className="hdv-bottom-grid">
        {/* Medicines Table */}
        <Card className="p-6 rounded-[28px] border border-slate-100 shadow-md bg-white" style={{ order: 2 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Pill size={22} /></div>
              <h3 className="text-lg font-black text-slate-800">الأدوية الأساسية المتوفرة</h3>
            </div>
            <Button variant="ghost" className="text-blue-500 font-black flex items-center gap-1 hover:bg-blue-50 text-sm">
              عرض الكل <ChevronLeft size={16} />
            </Button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-right border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 text-sm">
                  <th className="pb-2 pr-4 font-black">الدواء</th>
                  <th className="pb-2 font-black">الفئة</th>
                  <th className="pb-2 font-black text-center">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'إنسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', color: 'amber' },
                  { name: 'باراسيتامول (Paracetamol)', category: 'مسكن آلام', status: 'متوفر', color: 'green' },
                  { name: 'أموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', color: 'green' },
                ].map((med, i) => (
                  <tr key={i} className="bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <td className="py-4 pr-5 rounded-r-2xl font-black text-slate-800 text-sm">{med.name}</td>
                    <td className="py-4 font-bold text-slate-500 text-sm">{med.category}</td>
                    <td className="py-4 rounded-l-2xl text-center">
                      <span className={`font-black text-sm text-${med.color}-500`}>{med.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Working Hours */}
        <Card className="p-6 rounded-[28px] border border-slate-100 shadow-md bg-white" style={{ order: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Clock size={22} /></div>
            <h3 className="text-lg font-black text-slate-800">ساعات العمل</h3>
          </div>
          <div className="bg-red-50 p-4 rounded-[20px] flex items-center gap-3 mb-6 border border-red-100">
            <AlertCircle size={22} className="text-red-500 flex-shrink-0" />
            <span className="text-red-600 font-black text-sm leading-tight">قسم الطوارئ يعمل على مدار 24 ساعة</span>
          </div>
          <div className="flex flex-col gap-5 font-bold text-sm">
            {[
              { label: 'السبت - الخميس (العيادات)', time: 'من 8:00 ص - 2:00 م', red: false },
              { label: 'الجمعة', time: 'مغلق (للطوارئ فقط)', red: true },
              { label: 'الصيدلية الخارجية', time: 'من 8:00 ص - 8:00 م', red: false },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-800 font-black">{row.label}</span>
                <span className={row.red ? 'text-red-500 font-black' : 'text-slate-500'}>{row.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Footer ── */}
      <Card className="mt-6 mb-4 rounded-[28px] border-none shadow-md bg-white overflow-hidden p-0">
        <div className="hdv-footer-inner flex items-center justify-between p-6 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 bg-white rounded-2xl shadow-sm p-1 flex-shrink-0">
              <Image src="/assets/Logo2.png" alt="Health Logo" fill className="object-contain p-1" />
            </div>
            <div className="flex flex-col text-right">
              <h4 className="text-base font-black text-slate-800">منصة نجاة للخدمات الإنسانية والطوارئ</h4>
              <p className="text-slate-500 text-xs font-bold mt-1">دليلك الصحي في قطاع غزة</p>
            </div>
          </div>
          <div className="hdv-footer-btns flex items-center">
            <Button variant="outline" className="border-slate-200 text-slate-600 font-black px-6 py-4 rounded-2xl text-sm hover:bg-slate-100 transition-all" onClick={onBack}>
              رجوع للخدمات الصحية
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-4 rounded-2xl text-sm shadow-lg shadow-red-500/20">
              اتصال بالطوارئ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
