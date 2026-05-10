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
      className="adv-root flex flex-col h-full overflow-y-auto no-scrollbar pb-10"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff', gap: 0 }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Hero */
        .adv-hero { height: 480px; border-radius: 32px; }
        @media (max-width: 768px) { .adv-hero { height: 320px; border-radius: 20px; } }

        .adv-title { font-size: 3.75rem; }
        @media (max-width: 768px) { .adv-title { font-size: 1.5rem; } }

        .adv-address { font-size: 1.25rem; }
        @media (max-width: 768px) { .adv-address { font-size: 0.8rem; } }

        .adv-hero-content { bottom: 2.5rem; right: 2.5rem; gap: 1rem; }
        @media (max-width: 768px) { .adv-hero-content { bottom: 4.5rem; right: 1rem; gap: 0.5rem; } }

        .adv-hero-btns { bottom: 2.5rem; left: 2.5rem; gap: 1rem; }
        @media (max-width: 768px) { .adv-hero-btns { bottom: 1rem; right: 1rem; left: 1rem; gap: 0.5rem; justify-content: flex-start; flex-wrap: wrap; } }

        .adv-badge { padding: 8px 20px; font-size: 13px; }
        @media (max-width: 768px) { .adv-badge { padding: 4px 10px; font-size: 10px; } }

        .adv-btn { padding: 10px 24px; font-size: 13px; height: 44px; }
        @media (max-width: 768px) { .adv-btn { padding: 6px 12px; font-size: 11px; height: 34px; } }

        /* Doctors card wrapper */
        .adv-card-wrap { margin: 32px 0 0; padding: 32px; border-radius: 32px; }
        @media (max-width: 768px) { .adv-card-wrap { margin: 16px 0 0; padding: 16px; border-radius: 20px; } }

        /* Doctors grid */
        .adv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; }
        @media (max-width: 900px) { .adv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .adv-grid { grid-template-columns: repeat(1, 1fr); } }
      `}} />

      {/* ── Hero (same as HospitalDetailView) ── */}
      <div className="adv-hero relative w-full overflow-hidden shadow-2xl flex-shrink-0">
        <Image src="/assets/health1.jpg" alt="Hospital Header" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Bottom-right: name + badges */}
        <div className="adv-hero-content absolute flex flex-col items-start text-white text-right">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className="adv-badge bg-amber-500 text-white rounded-full font-black flex items-center gap-2 shadow-lg">
              <TriangleAlert size={14} />
              قدرة استيعابية محدودة
            </div>
            <div className="adv-badge bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-black shadow-lg">
              آخر تحديث منذ 15 دقيقة
            </div>
          </div>
          <h1 className="adv-title font-black mb-1 drop-shadow-lg leading-tight">مستشفى شهداء الأقصى</h1>
          <div className="adv-address flex items-center gap-2 font-bold drop-shadow-md">
            <MapPin size={20} className="text-white flex-shrink-0" />
            <span>غزة - الرمال - شارع الشهداء</span>
          </div>
        </div>

        {/* Bottom-left: اتصال + عرض الخريطة */}
        <div className="adv-hero-btns absolute flex items-center">
          <Button className="adv-btn bg-white text-slate-800 hover:bg-slate-100 font-black rounded-2xl flex items-center gap-2 shadow-xl">
            <Phone size={16} className="text-blue-500" />
            اتصال
          </Button>
          <Button
            onClick={onShowMap}
            className="adv-btn bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <MapPin size={16} />
            عرض الخريطة
          </Button>
        </div>
      </div>

      {/* ── Doctors Card ── */}
      <div
        className="adv-card-wrap"
        style={{
          border: '2px solid #f1f5f9',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          background: '#fff',
          boxSizing: 'border-box',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://api.iconify.design/healthicons:doctor-male.svg?color=%232196f3"
              alt="doctor"
              style={{ width: '26px', height: '26px' }}
            />
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Cairo', sans-serif" }}>
              الأطباء المناوبون الآن
            </h2>
          </div>

          {/* Back – text + chevron, no border */}
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
            <span style={{ fontSize: '20px', lineHeight: 1 }}>›</span>
          </button>
        </div>

        {/* Doctors grid */}
        <div className="adv-grid">
          {DOCTORS.map((doctor, i) => (
            <div
              key={i}
              style={{
                background: '#EAF6FD',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
                boxSizing: 'border-box',
              }}
            >
              {/* Avatar + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', minWidth: '48px',
                  borderRadius: '50%', overflow: 'hidden',
                  background: '#fff', border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}>
                  <img src={doctor.photo} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: '14px', color: '#1e293b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.4 }}>
                    {doctor.name}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', fontWeight: 600, color: '#64748b', fontFamily: "'Cairo', sans-serif", lineHeight: 1.3 }}>
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Schedule */}
              <div style={{ marginTop: 'auto' }}>
                <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 800, color: '#64748b', fontFamily: "'Cairo', sans-serif" }}>
                  مواعيد العمل أسبوعياً
                </p>
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
    </div>
  )
}
