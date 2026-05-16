'use client'

import React, { useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { HealthDoctor } from '@/schemas/healthFacilityDetail'

const FALLBACK: HealthDoctor[] = [
  {
    name: 'د. ناصر رأفت أبو شعبان',
    specialty: 'استشاري الجراحة العامة وجراحة المناظير',
    photo: '/assets/doctor.png',
    time: 'من 10:00 ص - 2:00 م',
    days: ['الأحد', 'الخميس'],
  },
  {
    name: 'د. محمد صلاح اللولو',
    specialty: 'أخصائي عيون',
    photo: '/assets/health6.jpg',
    time: 'من 1:30 م - 5:00 م',
    days: ['السبت', 'الخميس'],
  },
  {
    name: 'د. سلامة سعيد التتر',
    specialty: 'استشاري أمراض السكري والغدد',
    photo: '/assets/health2.jpg',
    time: 'من 1:30 م - 5:00 م',
    days: ['السبت', 'الخميس'],
  },
  {
    name: 'د. شادي عبد الحكيم الحداد',
    specialty: 'أخصائي طب وجراحة الفم والأسنان',
    photo: '/assets/Photo2.jpg',
    time: 'من 10:00 ص - 2:00 م',
    days: ['الأحد', 'الأربعاء'],
  },
]

function buildPreviewDoctors(
  doctors: HealthDoctor[] | undefined,
  fallback: HealthDoctor[],
  target: number,
): HealthDoctor[] {
  // Use real doctors if available, otherwise fall back to placeholder
  const pool = doctors?.length ? doctors : fallback
  const seen = new Set<string>()
  const out: HealthDoctor[] = []
  for (const d of pool) {
    if (out.length >= target) break
    if (seen.has(d.name)) continue
    seen.add(d.name)
    out.push(d)
  }
  return out
}

interface HospitalDoctorsSectionProps {
  onShowAll: () => void
  doctors?: HealthDoctor[]
}

const PREVIEW_DOCTOR_COUNT = 4

export default function HospitalDoctorsSection({
  onShowAll,
  doctors,
}: HospitalDoctorsSectionProps) {
  const preview = useMemo(
    () => buildPreviewDoctors(doctors, FALLBACK, PREVIEW_DOCTOR_COUNT),
    [doctors],
  )
  const hasMore = (doctors?.length ?? 0) > PREVIEW_DOCTOR_COUNT

  return (
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: hasMore ? 'space-between' : 'flex-start',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://api.iconify.design/healthicons:doctor-male.svg?color=%232196f3" alt="doctor" style={{ width: '26px', height: '26px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Cairo', sans-serif" }}>الأطباء المناوبون الآن</h3>
        </div>
        {hasMore ? (
          <Button variant="ghost" className="text-[#2196F3] font-black flex items-center gap-1 hover:bg-blue-50 px-3 text-sm" onClick={onShowAll}>
            عرض المزيد
            <ChevronLeft size={18} />
          </Button>
        ) : null}
      </div>

      <div className="hdv-doctors-grid">
        {preview.map((doctor, i) => (
          <div key={`${doctor.name}-${i}`} style={{ background: '#EAF6FD', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', textAlign: 'right', boxSizing: 'border-box' }}>
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
  )
}
