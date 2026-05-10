'use client'

import React from 'react'
import { Phone, MapPin, TriangleAlert, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface AllDoctorsViewProps {
  hospital: any
  onBack: () => void
  onShowMap: () => void
}

const DOCTORS = [
  { name: 'د. ناصر رأفت أبو شعبان',    specialty: 'استشاري الجراحة العامة وجراحة المناظير', photo: '/assets/doctor.png',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الخميس']   },
  { name: 'د. محمد صلاح اللولو',        specialty: 'أخصائي عيون',                            photo: '/assets/health6.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس']   },
  { name: 'د. سلامة سعيد التتر',         specialty: 'استشاري أمراض السكري والغدد',            photo: '/assets/health2.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس']   },
  { name: 'د. شادي عبد الحكيم الحداد',   specialty: 'أخصائي طب وجراحة الفم والأسنان',       photo: '/assets/Photo2.jpg',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الأربعاء']  },
  { name: 'د. ناصر رأفت أبو شعبان',    specialty: 'استشاري الجراحة العامة وجراحة المناظير', photo: '/assets/doctor.png',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الخميس']   },
  { name: 'د. محمد صلاح اللولو',        specialty: 'أخصائي عيون',                            photo: '/assets/health6.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس']   },
  { name: 'د. سلامة سعيد التتر',         specialty: 'استشاري أمراض السكري والغدد',            photo: '/assets/health2.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس']   },
  { name: 'د. شادي عبد الحكيم الحداد',   specialty: 'أخصائي طب وجراحة الفم والأسنان',       photo: '/assets/Photo2.jpg',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الأربعاء']  },
  { name: 'د. ناصر رأفت أبو شعبان',    specialty: 'استشاري الجراحة العامة وجراحة المناظير', photo: '/assets/doctor.png',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الخميس']   },
  { name: 'د. محمد صلاح اللولو',        specialty: 'أخصائي عيون',                            photo: '/assets/health6.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس']   },
  { name: 'د. سلامة سعيد التتر',         specialty: 'استشاري أمراض السكري والغدد',            photo: '/assets/health2.jpg', time: 'من 1:30 ص - 5:00 م',  days: ['السبت', 'الخميس']   },
  { name: 'د. شادي عبد الحكيم الحداد',   specialty: 'أخصائي طب وجراحة الفم والأسنان',       photo: '/assets/Photo2.jpg',  time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الأربعاء']  },
]

export default function AllDoctorsView({ hospital, onBack, onShowMap }: AllDoctorsViewProps) {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto no-scrollbar pb-10"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff', gap: 0 }}
    >

      {/* ── نفس هيدر صفحة التفاصيل ── */}
      <div className="relative w-full h-[480px] rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0">
        <Image
          src="/assets/health1.jpg"
          alt="Hospital Header"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Hospital name + address – bottom right */}
        <div
          className="absolute bottom-10 right-10 flex flex-col items-start gap-4 text-white text-right"
          style={{ minWidth: 'fit-content' }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-amber-500 text-white px-5 py-2 rounded-full text-[13px] font-black flex items-center gap-2 shadow-lg">
              <TriangleAlert size={16} />
              قدرة استيعابية محدودة
            </div>
            <div className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-2 rounded-full text-[13px] font-black shadow-lg">
              آخر تحديث منذ 15 دقيقة
            </div>
          </div>
          <h1 className="text-6xl font-black mb-2 drop-shadow-lg leading-tight">مستشفى شهداء الأقصى</h1>
          <div className="flex items-center gap-3 text-xl font-bold drop-shadow-md">
            <MapPin size={26} className="text-white" />
            <span>غزة - الرمال - شارع الشهداء</span>
          </div>
        </div>

        {/* Buttons – bottom left: اتصال + عرض الخريطة */}
        <div className="absolute bottom-10 left-10 flex items-center gap-4">
          <Button className="bg-white text-slate-800 hover:bg-slate-100 font-black px-10 py-5 rounded-2xl text-sm flex items-center gap-2 shadow-xl h-12">
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

      {/* ── Doctors Card (with border, matching style) ── */}
      <div style={{
        margin: '32px 0 0 0',
        padding: '32px',
        border: '2px solid #f1f5f9',
        borderRadius: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        background: '#fff',
        boxSizing: 'border-box',
      }}>

        {/* Section header row: title right, back-arrow far left */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://api.iconify.design/healthicons:doctor-male.svg?color=%232196f3"
              alt="doctor"
              style={{ width: '28px', height: '28px' }}
            />
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Cairo', sans-serif" }}>
              الأطباء المناوبون الآن
            </h2>
          </div>

          {/* Back button – text only, no border / no background */}
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#2196F3',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              padding: '4px 0',
              direction: 'ltr',
            }}
          >
            رجوع
            <span style={{ fontSize: '25px', lineHeight: 1 }}>›</span>
          </button>
        </div>

        {/* 4-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            width: '100%',
          }}
          className="all-doctors-grid"
        >
          {DOCTORS.map((doctor, i) => (
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
                  <p style={{ margin: 0, fontWeight: 900, fontSize: '15px', color: '#1e293b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.4 }}>
                    {doctor.name}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: '#64748b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.4 }}>
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', fontFamily: "'Cairo', sans-serif" }}>
                  مواعيد العمل اسبوعيا
                </p>
                {doctor.days.map((day, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#334155', fontFamily: "'Cairo', sans-serif" }}>
                      {day}
                    </span>
                    <span dir="ltr" style={{ fontSize: '12px', fontWeight: 700, color: '#475569', fontFamily: "'Cairo', sans-serif" }}>
                      {doctor.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive breakpoints */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px)  { .all-doctors-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .all-doctors-grid { grid-template-columns: repeat(1, 1fr) !important; } }
      `}} />
    </div>
  )
}
