'use client'

import React from 'react'
import { ArrowRight, Phone, MapPin, Clock, Stethoscope, Pill, AlertCircle, ChevronLeft, TriangleAlert, Activity, Map, Baby, Eye, Monitor, Droplets, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface HospitalDetailViewProps {
  hospital: any
  onBack: () => void
  onShowMap: () => void
  onShowAllDoctors: () => void
}

export default function HospitalDetailView({ hospital, onBack, onShowMap, onShowAllDoctors }: HospitalDetailViewProps) {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-10" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff' }}>
      
      {/* ── Header Image Card ── */}
      <div className="relative w-full h-[480px] rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0">
        <Image 
          src="/assets/health1.jpg" 
          alt="Hospital Header" 
          fill 
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        
        {/* Header Content Wrapper - Pinned Flush to the Right */}
        <div 
          className="absolute bottom-10 right-10 flex flex-col items-start gap-4 text-white text-right"
          style={{ width: 'auto', minWidth: 'fit-content' }}
        >
          
          {/* Badges - Swapped and Updated Icon */}
          <div className="flex items-center justify-start gap-3 mb-1 w-full">
             <div className="bg-amber-500 text-white px-5 py-2 rounded-full text-[13px] font-black flex items-center gap-2 shadow-lg">
               <TriangleAlert size={16} />
               قدرة استيعابية محدودة
             </div>
             <div className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-2 rounded-full text-[13px] font-black shadow-lg">
               آخر تحديث منذ 15 دقيقة
             </div>
          </div>
          
          {/* Hospital Title - Right Aligned */}
          <h1 className="text-6xl font-black mb-2 drop-shadow-lg leading-tight">{"مستشفى شهداء الأقصى"}</h1>
          
          {/* Address - Right Aligned, Icon swapped to the left of text */}
          <div className="flex items-center gap-3 text-xl font-bold opacity-100 drop-shadow-md">
             <MapPin size={26} className="text-white" />
             <span>غزة - الرمال - شارع الشهداء</span>
          </div>
        </div>

        {/* Buttons - Separately pinned to the Left */}
        <div className="absolute bottom-10 left-10 flex items-center gap-4">
           <Button 
              className="bg-white text-slate-800 hover:bg-slate-100 font-black px-10 py-5 rounded-2xl text-sm flex items-center gap-2 shadow-xl h-12"
            >
              <Phone size={20} className="text-blue-500" />
              اتصال
            </Button>
            <Button 
              onClick={onShowMap}
              className="bg-blue-500 hover:bg-blue-600 text-white font-black px-10 py-5 rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 h-12"
            >
              <MapPin size={20} />
              عرض الخريطة
            </Button>
        </div>
      </div>

      {/* ── Middle Sections: Services & Map Snippet ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 h-fit px-1">
        
        {/* Right: Services (Span 7) */}
        <div className="lg:col-span-7 order-1">
          <Card className="p-6 rounded-[32px] border-2 border-slate-100 shadow-xl bg-white flex flex-col h-[300px]">
            <div className="flex items-center justify-start gap-3 mb-6">
               <div className="text-[#2196F3]">
                  <Activity size={24} />
               </div>
               <h3 className="text-xl font-black text-slate-800">الخدمات الطبية المتاحة</h3>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-start overflow-y-auto no-scrollbar pb-2">
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
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 border-[#2196F3] bg-white shadow-sm hover:bg-blue-50 transition-all cursor-default">
                  <service.icon size={18} className="text-[#F2A122]" />
                  <span className="text-[13px] font-black text-slate-700">{service.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Left: Map/Location (Span 5) */}
        <div className="lg:col-span-5 order-2">
          <Card className="p-6 rounded-[32px] border-2 border-slate-100 shadow-xl bg-white flex flex-col h-[300px]">
            <div className="flex items-center justify-start gap-3 mb-4">
               <Map size={24} className="text-[#2196F3]" />
               <h3 className="text-xl font-black text-slate-800">الموقع والاتصال</h3>
            </div>
            
            <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 shadow-inner border border-slate-100">
               <Image src="/assets/health5.jpg" alt="Map Snippet" fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-3 text-right items-start">
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin size={22} className="text-[#F2A122] flex-shrink-0" />
                <span className="font-black text-base">غزة - الرمال - شارع الشهداء</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone size={22} className="text-[#F2A122] flex-shrink-0" />
                <span className="font-black text-base">0595188009</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* ── Doctors Section ── */}
      <div style={{
        padding: '32px',
        marginTop: '32px',
        border: '2px solid #f1f5f9',
        borderRadius: '32px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        background: '#fff',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'visible',
      }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="https://api.iconify.design/healthicons:doctor-male.svg?color=%232196f3" alt="doctor" style={{ width: '28px', height: '28px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Cairo', sans-serif" }}>الأطباء المناوبون الآن</h3>
          </div>
          <Button variant="ghost" className="text-[#2196F3] font-black flex items-center gap-2 hover:bg-blue-50 px-4" onClick={onShowAllDoctors}>
            عرض الكل
            <ChevronLeft size={20} />
          </Button>
        </div>

        {/* 4 Doctor Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          width: '100%',
        }}>
          {[
            { name: 'د. ناصر رأفت أبو شعبان', specialty: 'استشاري الجراحة العامة وجراحة المناظير', photo: '/assets/doctor.png', time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الخميس'] },
            { name: 'د. محمد صلاح اللولو', specialty: 'أخصائي عيون', photo: '/assets/health6.jpg', time: 'من 1:30 ص - 5:00 م', days: ['السبت', 'الخميس'] },
            { name: 'د. سلامة سعيد التتر', specialty: 'استشاري أمراض السكري والغدد', photo: '/assets/health2.jpg', time: 'من 1:30 ص - 5:00 م', days: ['السبت', 'الخميس'] },
            { name: 'د. شادي عبد الحكيم الحداد', specialty: 'أخصائي طب وجراحة الفم والأسنان', photo: '/assets/Photo2.jpg', time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الأربعاء'] },
          ].map((doctor, i) => (
            <div
              key={i}
              style={{
                background: '#EAF6FD',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
                boxSizing: 'border-box',
              }}
            >
              {/* Avatar + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  minWidth: '52px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#fff',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}>
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: '15px', color: '#1e293b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.4 }}>{doctor.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: '#64748b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.4 }}>{doctor.specialty}</p>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', fontFamily: "'Cairo', sans-serif" }}>مواعيد العمل اسبوعيا</p>
                {doctor.days.map((day, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#334155', fontFamily: "'Cairo', sans-serif" }}>{day}</span>
                    <span dir="ltr" style={{ fontSize: '12px', fontWeight: 700, color: '#475569', fontFamily: "'Cairo', sans-serif" }}>{doctor.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Grid: Medicines & Hours ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Right: Medicines Table (Span 8) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
           <Card className="p-10 rounded-[32px] border border-slate-100 shadow-xl bg-white">
             <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500">
                     <Pill size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">الأدوية الأساسية المتوفرة</h3>
               </div>
               <Button variant="ghost" className="text-blue-500 font-black flex items-center gap-1 hover:bg-blue-50" onClick={() => {}}>
                  عرض الكل
                  <ChevronLeft size={18} />
               </Button>
             </div>

             <div className="w-full overflow-x-auto">
               <table className="w-full text-right border-separate border-spacing-y-4">
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
                       <td className="py-5 pr-6 rounded-r-2xl font-black text-slate-800 text-base">{med.name}</td>
                       <td className="py-5 font-bold text-slate-500">{med.category}</td>
                       <td className="py-5 rounded-l-2xl text-center">
                          <span className={`font-black text-sm text-${med.color}-500`}>{med.status}</span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </Card>
        </div>

        {/* Left: Working Hours (Span 4) */}
        <div className="lg:col-span-4 order-2 lg:order-1">
           <Card className="p-10 rounded-[32px] border border-slate-100 shadow-xl bg-white h-full">
             <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500">
                   <Clock size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800">ساعات العمل</h3>
             </div>

             <div className="bg-red-50 p-5 rounded-[24px] flex items-center gap-4 mb-10 border border-red-100">
                <AlertCircle size={24} className="text-red-500" />
                <span className="text-red-600 font-black text-base leading-tight">قسم الطوارئ يعمل على مدار 24 ساعة</span>
             </div>

             <div className="flex flex-col gap-8 font-bold text-base">
                <div className="flex justify-between items-center">
                   <span className="text-slate-800 font-black">السبت - الخميس (العيادات)</span>
                   <span className="text-slate-500">من 8:00 ص - 2:00 م</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-slate-800 font-black">الجمعة</span>
                   <span className="text-red-500 font-black">مغلق (للطوارئ فقط)</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-slate-800 font-black">الصيدلية الخارجية</span>
                   <span className="text-slate-500">من 8:00 ص - 8:00 م</span>
                </div>
             </div>
           </Card>
        </div>
      </div>

      {/* ── Footer Branding ── */}
      <Card className="mt-12 mb-6 rounded-[32px] border-none shadow-lg bg-white overflow-hidden p-0">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:px-12 bg-slate-50/50">
           <div className="flex items-center gap-6 mb-6 md:mb-0">
              <div className="relative w-16 h-16 bg-white rounded-2xl shadow-sm p-2">
                 <Image src="/assets/Logo2.png" alt="Health Logo" fill className="object-contain p-2" />
              </div>
              <div className="flex flex-col text-right">
                 <h4 className="text-xl font-black text-slate-800">منصة نجاة للخدمات الإنسانية والطوارئ</h4>
                 <p className="text-slate-500 text-sm font-bold mt-1">دليلك الصحي في قطاع غزة</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="border-slate-200 text-slate-600 font-black px-10 py-6 rounded-2xl text-base hover:bg-slate-100 transition-all" 
                onClick={onBack}
              >
                رجوع للخدمات الصحية
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white font-black px-10 py-6 rounded-2xl text-base shadow-xl shadow-red-500/20">
                اتصال بالطوارئ
              </Button>
           </div>
        </div>
      </Card>

    </div>
  )
}
