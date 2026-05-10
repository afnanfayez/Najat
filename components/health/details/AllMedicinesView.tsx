import React from 'react'
import Image from 'next/image'
import { MapPin, TriangleAlert, ChevronRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SharedHeroHeader from './SharedHeroHeader'

interface AllMedicinesViewProps {
  hospital: any
  onBack: () => void
  onShowMap: () => void
}

export default function AllMedicinesView({ hospital, onBack, onShowMap }: AllMedicinesViewProps) {
  const medicines = [
    { name: 'إنسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', color: '#F2A122' },
    { name: 'باراسيتامول (Paracetamol)', category: 'مسكن آلام', status: 'متوفر', color: '#22c55e' },
    { name: 'أموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', color: '#22c55e' },
    { name: 'أيبوبروفين (Ibuprofen)', category: 'مسكن آلام', status: 'غير متوفر', color: '#EF4444' },
    { name: 'أزيثرومايسين (Azithromycin)', category: 'مضاد حيوي', status: 'متوفر', color: '#22c55e' },
    { name: 'سالبوتامول (Salbutamol)', category: 'تنفسي وربو', status: 'متوفر', color: '#22c55e' },
    { name: 'بيسوبرولول (Bisoprolol)', category: 'أمراض القلب', status: 'كمية محدودة', color: '#F2A122' },
    { name: 'ديكساميثازون (Dexamethasone)', category: 'كورتيزون', status: 'متوفر', color: '#22c55e' },
    { name: 'فيتامين سي (Vitamin C)', category: 'مكملات', status: 'متوفر', color: '#22c55e' },
    { name: 'أوميبرازول (Omeprazole)', category: 'الجهاز الهضمي', status: 'كمية محدودة', color: '#F2A122' },
  ];

  return (
    <div
      className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-10"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Card Wrap ── */
        .amv-card-wrap { margin: 32px 0 0; padding: 32px; border-radius: 32px; }
        @media (max-width: 768px) { .amv-card-wrap { margin: 16px 0 0; padding: 16px; border-radius: 20px; } }
      `}} />

      <SharedHeroHeader hospital={hospital} onShowMap={onShowMap} />

      {/* ── Medicines Card ── */}
      <div
        className="amv-card-wrap"
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
            <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="medicines" style={{ width: '26px', height: '26px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Cairo', sans-serif" }}>
              جميع الأدوية الأساسية المتوفرة
            </h2>
          </div>

          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            <ChevronRight size={18} /> رجوع
          </button>
        </div>

        {/* Medicines Table */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-right" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="rounded-xl text-slate-800 text-[16px]" style={{ background: '#7E7D7D0F' }}>
                <th className="py-4 pr-5 font-black rounded-r-xl w-[50%]">الدواء</th>
                <th className="py-4 font-black text-center w-[25%]">الفئة</th>
                <th className="py-4 font-black text-center rounded-l-xl w-[25%]">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 pr-5 font-black text-slate-800 text-[16px]">{med.name}</td>
                  <td className="py-5 font-bold text-slate-600 text-[16px] text-center">{med.category}</td>
                  <td className="py-5 text-center">
                    <span className="font-black text-[15px]" style={{ color: med.color }}>{med.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
