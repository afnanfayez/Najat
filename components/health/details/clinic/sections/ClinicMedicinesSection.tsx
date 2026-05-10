'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

const MEDICINES = [
  { name: 'انسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', statusColor: '#F59E0B' },
  { name: 'باراسيتامول (Paracetamol)', category: 'مسكن الالم', status: 'متوفر', statusColor: '#22C55E' },
  { name: 'اموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', statusColor: '#22C55E' },
]

interface ClinicMedicinesSectionProps {
  onShowAll: () => void
}

export default function ClinicMedicinesSection({ onShowAll }: ClinicMedicinesSectionProps) {
  return (
    <Card className="p-5 sm:p-7 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="icon" className="w-6 h-6" />
          <h3 className="text-lg sm:text-xl font-black text-slate-800">الادوية الاساسية المتوفرة</h3>
        </div>
        <button 
          onClick={onShowAll}
          className="flex items-center gap-1.5 px-2 py-1 text-blue-500 font-black text-base sm:text-lg hover:text-blue-700 transition-all"
        >
          عرض الكل
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="pb-4 pt-2 px-4 text-slate-400 font-bold text-sm">الدواء</th>
              <th className="pb-4 pt-2 px-4 text-slate-400 font-bold text-sm text-center">الفئة</th>
              <th className="pb-4 pt-2 px-4 text-slate-400 font-bold text-sm text-left">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MEDICINES.map((med, i) => (
              <tr key={i} className="group hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <span className="text-[13px] sm:text-[14px] font-black text-slate-800">{med.name}</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-[12px] sm:text-[13px] font-bold text-slate-600">{med.category}</span>
                </td>
                <td className="py-4 px-4 text-left">
                  <span 
                    className="text-[11px] sm:text-[12px] font-black px-2 py-1 rounded-md"
                    style={{ color: med.statusColor }}
                  >
                    {med.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
