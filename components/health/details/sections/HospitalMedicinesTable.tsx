'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { HealthMedicineRow } from '@/schemas/healthFacilityDetail'
import { MOCK_HOSPITAL_MEDICINES } from '@/lib/mocks/healthFacilityDetailsMockData'

interface HospitalMedicinesTableProps {
  onShowAll: () => void
  medicines?: HealthMedicineRow[]
  /** إن وُجدت، تُستخدم لمعرفة وجود قائمة أطول في شاشة «عرض المزيد» */
  medicinesAll?: HealthMedicineRow[]
}

const PREVIEW_MEDICINE_COUNT = 3

export default function HospitalMedicinesTable({
  onShowAll,
  medicines,
  medicinesAll,
}: HospitalMedicinesTableProps) {
  const list =
    medicines?.length ? medicines
    : medicinesAll?.length ? medicinesAll
    : MOCK_HOSPITAL_MEDICINES
  const preview = list.slice(0, PREVIEW_MEDICINE_COUNT)
  const fullCount = Math.max(list.length, medicinesAll?.length ?? 0)
  const usingFallback = !medicines?.length && !medicinesAll?.length
  const hasMore =
    fullCount > PREVIEW_MEDICINE_COUNT || usingFallback

  return (
    <Card className="p-4 sm:p-5 rounded-[24px] border border-slate-100 shadow-md bg-white">
      <div className={`flex items-center mb-4 ${hasMore ? 'justify-between' : 'justify-start'}`}>
        <div className="flex items-center gap-2">
          <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="medicines" className="w-6 h-6" />
          <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>الأدوية الأساسية المتوفرة</h3>
        </div>
        {hasMore ? (
          <Button onClick={onShowAll} variant="ghost" className="text-[#2196F3] font-bold flex items-center gap-1 hover:bg-blue-50 text-[15px]">
            عرض المزيد <ChevronLeft size={18} />
          </Button>
        ) : null}
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
            {preview.map((med, i) => (
              <tr key={`${med.name}-${i}`} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 pr-4 font-black text-slate-800 text-[14px]">{med.name}</td>
                <td className="py-3.5 font-bold text-slate-600 text-[14px] text-center">{med.category}</td>
                <td className="py-3.5 text-center">
                  <span className="font-black text-[13px]" style={{ color: med.color ?? '#64748b' }}>{med.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
