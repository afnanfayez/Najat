'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { ClinicServiceItem } from '@/schemas/healthFacilityDetail'
import { MOCK_CLINIC_SERVICES } from '@/lib/mocks/healthFacilityDetailsMockData'

function norm(s: string) {
  return s.trim().toLowerCase()
}

interface ClinicServicesSectionProps {
  services?: ClinicServiceItem[]
}

export default function ClinicServicesSection({ services }: ClinicServicesSectionProps) {
  const [q, setQ] = React.useState('')

  const filtered = React.useMemo(() => {
    const list = services?.length ? services : MOCK_CLINIC_SERVICES
    const query = norm(q)
    if (!query) return list
    return list.filter((s) =>
      norm(`${s.name} ${s.desc}`).includes(query),
    )
  }, [services, q])

  return (
    <Card className="p-5 sm:p-7 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="icon" className="w-6 h-6" />
        <h3 className="text-lg sm:text-xl font-black text-slate-800">الخدمات والفحوصات المتوفرة</h3>
      </div>

      <div className="relative mb-5 sm:mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن الخدمة..."
          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pr-11 pl-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((service, i) => (
          <div
            key={`${service.name}-${i}`}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 bg-white hover:border-blue-50 transition-all cursor-default"
          >
            <img src={service.icon} alt={service.name} className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" />
            
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="text-[14px] sm:text-[15px] font-black text-slate-800 truncate">{service.name}</span>
              <span className="text-slate-400 text-[11px] font-bold truncate">{service.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {!filtered.length ? (
        <p className="text-center text-slate-500 font-bold py-6">لا توجد نتائج مطابقة</p>
      ) : null}
    </Card>
  )
}
