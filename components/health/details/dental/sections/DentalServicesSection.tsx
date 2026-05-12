'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Search, Info } from 'lucide-react'
import type { DentalServiceItem } from '@/schemas/healthFacilityDetail'

const FALLBACK_TABS = ['الكل', 'حشوات', 'جراحة', 'تجميل', 'تقويم']

const FALLBACK_SERVICES: DentalServiceItem[] = [
  { name: 'حشوة كومبوزيت (تجميلية)', desc: 'حشوة تجميلية بلون السن', icon: 'https://api.iconify.design/healthicons:odontology.svg?color=%23F2A122', group: 'حشوات' },
  { name: 'زراعة الاسنان', desc: 'تعويض الاسنان المفقودة', icon: 'https://api.iconify.design/healthicons:odontology-implant.svg?color=%23F2A122', group: 'جراحة' },
  { name: 'تبييض اسنان', desc: 'تبييض كيميائي وليزر', icon: 'https://api.iconify.design/healthicons:tooth.svg?color=%23F2A122', group: 'تجميل' },
  { name: 'خلع ضرس', desc: 'اجراء جراحي لخلع بسيط', icon: 'https://api.iconify.design/healthicons:tooth.svg?color=%23F2A122', group: 'جراحة' },
  { name: 'تنظيف وتجريف اللثة', desc: 'ازالة الرواسب الكلسية', icon: 'https://api.iconify.design/healthicons:clean-hands.svg?color=%23F2A122', group: 'تجميل' },
  { name: 'سحب عصب', desc: 'علاج القنوات الجزرية', icon: 'https://api.iconify.design/healthicons:spine.svg?color=%23F2A122', group: 'جراحة' },
]

function norm(s: string) {
  return s.trim().toLowerCase()
}

interface DentalServicesSectionProps {
  services?: DentalServiceItem[]
  tabLabels?: string[]
}

export default function DentalServicesSection({
  services,
  tabLabels,
}: DentalServicesSectionProps) {
  const tabs = tabLabels?.length ? tabLabels : FALLBACK_TABS
  const all = services?.length ? services : FALLBACK_SERVICES
  const [activeTab, setActiveTab] = React.useState(tabs[0] ?? 'الكل')
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    if (!tabs.includes(activeTab)) setActiveTab(tabs[0] ?? 'الكل')
  }, [tabs, activeTab])

  const filtered = all.filter((svc) => {
    const query = norm(q)
    if (query) {
      const hay = norm(`${svc.name} ${svc.desc} ${svc.group ?? ''}`)
      if (!hay.includes(query)) return false
    }
    if (activeTab === 'الكل') return true
    return svc.group === activeTab
  })

  return (
    <Card className="p-5 sm:p-7 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="icon" className="w-6 h-6" />
        <h3 className="text-lg sm:text-xl font-black text-slate-800">الخدمات المتوفرة</h3>
        <Info size={16} className="text-slate-400 flex-shrink-0" aria-hidden />
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن الخدمة..."
          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pr-11 pl-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 sm:mb-7">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-[13px] font-black transition-all ${
              activeTab === tab
                ? 'bg-[#2196F3] text-white shadow-md shadow-blue-100'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
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
