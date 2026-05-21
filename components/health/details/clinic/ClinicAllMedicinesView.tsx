'use client'

import React, { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import type { HealthMedicineRow } from '@/schemas/healthFacilityDetail'
import { MOCK_CLINIC_MEDICINES_ALL } from '@/lib/mocks/healthFacilityDetailsMockData'
import ClinicHeader from './sections/ClinicHeader'
import type { HealthFacility } from '@/schemas/healthFacility'

import '../../health.css'

interface ClinicAllMedicinesViewProps {
  clinic: HealthFacility
  onBack: () => void
  onShowMap: () => void
}

export default function ClinicAllMedicinesView({
  clinic,
  onBack,
  onShowMap,
}: ClinicAllMedicinesViewProps) {
  const medicines = useMemo(() => {
    const d = clinic.detail
    if (d?.clinicMedicinesAll?.length) return d.clinicMedicinesAll
    if (d?.clinicMedicines?.length) return d.clinicMedicines
    return MOCK_CLINIC_MEDICINES_ALL
  }, [clinic.detail, clinic.id])

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-10" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff' }}>
      
      <div className="w-full px-4 sm:px-10 mt-6 mb-8">
        <ClinicHeader clinic={clinic} onShowMap={onShowMap} />
      </div>

      <div className="px-4 sm:px-10">
        <div 
          className="rounded-[40px] border-2 border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] bg-white p-6 sm:p-10"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="medicines" className="w-7 h-7 sm:w-8 sm:h-8" />
              <h2 className="text-xl sm:text-2xl font-black text-[#1e293b]">جميع الأدوية الأساسية المتوفرة</h2>
            </div>

            <button
              onClick={onBack}
              className="flex items-center gap-1 text-blue-500 font-black text-[15px] sm:text-[16px] hover:text-blue-600 transition-all"
            >
              <ChevronRight size={20} /> رجوع
            </button>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full text-right" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="rounded-2xl text-slate-800 text-[16px] sm:text-[18px]" style={{ background: '#7E7D7D0F' }}>
                  <th className="py-5 pr-8 font-black rounded-r-2xl w-[50%]">الدواء</th>
                  <th className="py-5 font-black text-center w-[25%]">الفئة</th>
                  <th className="py-5 font-black text-center rounded-l-2xl w-[25%]">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, i) => (
                  <tr key={`${med.name}-${i}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 pr-8 font-black text-[#1e293b] text-[15px] sm:text-[17px]">{med.name}</td>
                    <td className="py-6 font-bold text-slate-600 text-[15px] sm:text-[17px] text-center">{med.category}</td>
                    <td className="py-5 text-center">
                      <span className="font-black text-[14px] sm:text-[16px]" style={{ color: med.statusColor ?? med.color ?? '#64748b' }}>{med.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
