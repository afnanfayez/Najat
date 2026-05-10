'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface HospitalMedicinesTableProps {
  onShowAll: () => void
}

const MEDICINES = [
  { name: 'إنسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', color: '#F2A122' },
  { name: 'باراسيتامول (Paracetamol)', category: 'مسكن آلام', status: 'متوفر', color: '#22c55e' },
  { name: 'أموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', color: '#22c55e' },
]

export default function HospitalMedicinesTable({ onShowAll }: HospitalMedicinesTableProps) {
  return (
    <Card className="p-4 sm:p-5 rounded-[24px] border border-slate-100 shadow-md bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="medicines" className="w-6 h-6" />
          <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>الأدوية الأساسية المتوفرة</h3>
        </div>
        <Button onClick={onShowAll} variant="ghost" className="text-[#2196F3] font-bold flex items-center gap-1 hover:bg-blue-50 text-[15px]">
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
            {MEDICINES.map((med, i) => (
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
  )
}
