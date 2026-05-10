'use client'

import React from 'react'
import { ArrowRight, Phone, MapPin, Clock, Stethoscope, Pill, AlertCircle, ChevronLeft, TriangleAlert, Activity, Map, Baby, Eye, Monitor, Droplets, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import SharedHeroHeader from './SharedHeroHeader'

interface HospitalDetailViewProps {
  hospital: any
  onBack: () => void
  onShowMap: () => void
  onShowAllDoctors: () => void
  onShowAllMedicines: () => void
}

export default function HospitalDetailView({ hospital, onBack, onShowMap, onShowAllDoctors, onShowAllMedicines }: HospitalDetailViewProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-2 relative" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff' }}>
      <style dangerouslySetInnerHTML={{ __html: `
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
        .hdv-bottom-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 24px; margin-top: 24px; }
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

      <SharedHeroHeader hospital={hospital} onShowMap={onShowMap} />

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
              <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23F2A122" alt="Location" className="w-5 h-5 flex-shrink-0" />
              <span className="font-black text-sm">{hospital?.address || 'غزة - الرمال - شارع الشهداء'}</span>
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
              <div style={{ marginTop: 'auto' }}>
                <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 800, color: '#64748b', fontFamily: "'Cairo', sans-serif" }}>مواعيد العمل أسبوعياً</p>
                {doctor.days.map((day, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b', fontFamily: "'Cairo', sans-serif" }}>{day}</span>
                    <span dir="ltr" style={{ fontSize: '13px', fontWeight: 700, color: '#475569', fontFamily: "'Cairo', sans-serif" }}>{doctor.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom: Medicines + Hours ── */}
      <div className="hdv-bottom-grid px-1">
        {/* Medicines Table */}
        <Card className="p-4 sm:p-5 rounded-[24px] border border-slate-100 shadow-md bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="medicines" className="w-6 h-6" />
              <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>الأدوية الأساسية المتوفرة</h3>
            </div>
            <Button onClick={onShowAllMedicines} variant="ghost" className="text-[#2196F3] font-bold flex items-center gap-1 hover:bg-blue-50 text-[15px]">
              عرض الكل <ChevronLeft size={18} />
            </Button>
          </div>
          <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full text-right" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="rounded-xl text-slate-800 text-[14px]" style={{ background: '#7E7D7D0F' }}>
                  <th className="py-3 pr-4 font-black rounded-r-xl w-[50%]">الدواء</th>
                  <th className="py-3 font-black text-center w-[25%]">الفئة</th>
                  <th className="py-3 font-black text-center rounded-l-xl w-[25%]">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'إنسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', color: '#F2A122' },
                  { name: 'باراسيتامول (Paracetamol)', category: 'مسكن آلام', status: 'متوفر', color: '#22c55e' },
                  { name: 'أموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', color: '#22c55e' },
                ].map((med, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pr-4 font-black text-slate-800 text-[14px]">{med.name}</td>
                    <td className="py-3.5 font-bold text-slate-600 text-[14px] text-center">{med.category}</td>
                    <td className="py-3.5 text-center">
                      <span className="font-black text-[13px]" style={{ color: med.color }}>{med.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Working Hours */}
        <Card className="p-4 sm:p-5 rounded-[24px] border border-slate-100 shadow-md bg-white">
          <div className="flex items-center gap-2 mb-4">
            <img src="https://api.iconify.design/solar:clock-circle-bold.svg?color=%232196f3" alt="time" className="w-6 h-6" />
            <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>ساعات العمل</h3>
          </div>
          <div className="bg-red-50 py-3 px-4 rounded-[16px] flex items-center justify-center gap-3 mb-6 w-full border border-red-100">
            <img src="https://api.iconify.design/solar:bell-bold.svg?color=%23ef4444" alt="emergency" className="w-7 h-7 flex-shrink-0" />
            <span className="text-[#EF4444] font-[900] text-[20px] text-center tracking-wide">قسم الطوارئ يعمل على مدار 24 ساعة</span>
          </div>
          <div className="flex flex-col font-bold text-[14px]">
            <div className="flex justify-between items-center px-1 mb-4">
              <span className="text-slate-800 font-black">السبت - الخميس (العيادات)</span>
              <span dir="ltr" className="text-slate-600">من 8:00 ص - 2:00 م</span>
            </div>
            
            <div className="flex justify-between items-center px-1 pb-4 mb-4 border-b border-slate-100">
              <span className="text-slate-800 font-black">الجمعة</span>
              <span dir="ltr" className="text-[#EF4444] font-black">مغلق (للطوارئ فقط)</span>
            </div>
            
            <div className="flex justify-between items-center px-1">
              <span className="text-slate-800 font-black">الصيدلية الخارجية</span>
              <span dir="ltr" className="text-slate-600">من 8:00 ص - 8:00 م</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Footer Section ── */}
      <div className="w-full px-1 flex justify-center mt-6 mb-2">
        <Card className="w-full h-auto xl:h-[100px] rounded-[24px] xl:rounded-[40px] border-2 border-slate-100 shadow-md bg-white p-0 overflow-hidden">
          <div className="flex flex-col xl:flex-row items-center justify-between h-full py-5 xl:py-0 px-4 sm:px-8 gap-5 xl:gap-6">
            {/* Right Content */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full xl:w-auto justify-center xl:justify-start">
              <div className="relative w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] flex-shrink-0">
                <Image src="/assets/logo1.png" alt="Health Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col text-center sm:text-right">
                <h4 className="text-[16px] sm:text-[18px] xl:text-[21px] font-[900] text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>منصة نجاة للخدمات الإنسانية والطوارئ</h4>
                <p className="text-slate-500 text-[13px] sm:text-[15px] xl:text-[16px] font-[800] mt-1" style={{ fontFamily: "'Cairo', sans-serif" }}>دليلك الصحي في قطاع غزة</p>
              </div>
            </div>
            {/* Left Content (Buttons) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
              <Button onClick={onBack} className="w-full sm:w-auto bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-[900] px-6 xl:px-8 py-6 xl:py-7 rounded-full text-[14px] xl:text-[17px] shadow-none" style={{ fontFamily: "'Cairo', sans-serif" }}>
                رجوع للخدمات الصحية
              </Button>
              <Button className="w-full sm:w-auto bg-[#EF4444] hover:bg-[#DC2626] text-white font-[900] px-6 xl:px-10 py-6 xl:py-7 rounded-full text-[14px] xl:text-[17px] shadow-none" style={{ fontFamily: "'Cairo', sans-serif" }}>
                اتصال بالطوارئ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
