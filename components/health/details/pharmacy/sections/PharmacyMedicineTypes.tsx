'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

const TYPES = [
  'أدوية الضغط المزمن',
  'أدوية مرضى السكر',
  'مسكنات',
  'المضادات الحيوية',
  'أدوية الأمراض النفسية',
  'مراهم الحروق',
  'فيتامينات',
  'منتجات تخص الأطفال',
  'منتجات العناية بالبشرة',
  'منتجات النظافة',
  'أدوية السموم',
]

export default function PharmacyMedicineTypes() {
  return (
    <Card className="p-5 sm:p-7 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <img src="https://api.iconify.design/solar:cup-bold.svg?color=%232196f3" alt="icon" className="w-5 h-5 sm:w-6 sm:h-6" />
        <h3 className="text-lg sm:text-xl font-black text-slate-800">أنواع الأدوية المتاحة</h3>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {TYPES.map((type, i) => (
          <div
            key={i}
            className="bg-[#e0f2fe] text-[#0369a1] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[12px] sm:text-[14px] font-black hover:bg-[#bae6fd] transition-colors cursor-default"
          >
            {type}
          </div>
        ))}
      </div>
    </Card>
  )
}
