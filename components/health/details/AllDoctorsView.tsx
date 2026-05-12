'use client'

import React, { useMemo } from 'react'
import type { HealthDoctor } from '@/schemas/healthFacilityDetail'
import SharedHeroHeader from './SharedHeroHeader'
import type { HealthFacility } from '@/schemas/healthFacility'

import '../health.css'

interface AllDoctorsViewProps {
  hospital: HealthFacility
  onBack: () => void
  onShowMap: () => void
}

const FALLBACK: HealthDoctor[] = [
  { name: 'د. ناصر رأفت أبو شعبان', specialty: 'استشاري الجراحة العامة وجراحة المناظير', photo: '/assets/doctor.png', time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الخميس'] },
  { name: 'د. محمد صلاح اللولو', specialty: 'أخصائي عيون', photo: '/assets/health6.jpg', time: 'من 1:30 م - 5:00 م', days: ['السبت', 'الخميس'] },
  { name: 'د. سلامة سعيد التتر', specialty: 'استشاري أمراض السكري والغدد', photo: '/assets/health2.jpg', time: 'من 1:30 م - 5:00 م', days: ['السبت', 'الخميس'] },
  { name: 'د. شادي عبد الحكيم الحداد', specialty: 'أخصائي طب وجراحة الفم والأسنان', photo: '/assets/Photo2.jpg', time: 'من 10:00 ص - 2:00 م', days: ['الأحد', 'الأربعاء'] },
]

function expandDoctors(base: HealthDoctor[]): HealthDoctor[] {
  if (base.length >= 8) return base
  const out: HealthDoctor[] = []
  let i = 0
  while (out.length < 12) {
    out.push(base[i % base.length])
    i += 1
  }
  return out
}

export default function AllDoctorsView({ hospital, onBack, onShowMap }: AllDoctorsViewProps) {
  const doctors = useMemo(() => {
    const base =
      hospital.detail?.doctors?.length ? hospital.detail.doctors : FALLBACK
    return expandDoctors(base)
  }, [hospital.detail?.doctors, hospital.id])

  return (
    <div
      className="adv-root flex flex-col h-full overflow-y-auto no-scrollbar pb-10"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff', gap: 0 }}
    >
      <SharedHeroHeader hospital={hospital} onShowMap={onShowMap} />

      <div
        className="adv-card-wrap"
        style={{
          border: '2px solid #f1f5f9',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          background: '#fff',
          boxSizing: 'border-box',
        }}
      >
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

        <div className="adv-grid">
          {doctors.map((doctor, i) => (
            <div
              key={`${doctor.name}-${i}`}
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
