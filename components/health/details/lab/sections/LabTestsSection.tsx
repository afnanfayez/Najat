'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Search, Clock } from 'lucide-react'
import type { LabTestItem } from '@/schemas/healthFacilityDetail'

const FALLBACK_TABS = ['الكل', 'فحوصات الدم', 'الهرمونات', 'وظائف الكبد', 'الفيروسات']

const FALLBACK_TESTS: LabTestItem[] = [
  { name: 'تعداد الدم الكامل (CBC)', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/solar:drop-bold.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'السكر التراكمي (HbA1c)', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/healthicons:hiv-self-test.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'فحص زمرة الدم', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/solar:box-bold.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'وظائف الكبد', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/solar:health-bold.svg?color=%23F2A122', group: 'وظائف الكبد' },
  { name: 'فحص التلاسيميا', time: 'النتيجة خلال أسبوع', icon: 'https://api.iconify.design/solar:graph-new-bold.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'فحص السرطان', time: 'النتيجة خلال 3 أيام', icon: 'https://api.iconify.design/solar:ribbon-bold.svg?color=%23F2A122', group: 'الفيروسات' },
]

function normalize(s: string) {
  return s.trim().toLowerCase()
}

interface LabTestsSectionProps {
  tests?: LabTestItem[]
  tabLabels?: string[]
}

export default function LabTestsSection({
  tests,
  tabLabels,
}: LabTestsSectionProps) {
  const tabs = tabLabels?.length ? tabLabels : FALLBACK_TABS
  const allTests = tests?.length ? tests : FALLBACK_TESTS
  const [activeTab, setActiveTab] = React.useState(tabs[0] ?? 'الكل')
  const [searchRaw, setSearchRaw] = React.useState('')

  React.useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0] ?? 'الكل')
    }
  }, [tabs, activeTab])

  const filtered = allTests.filter((test) => {
    const q = normalize(searchRaw)
    if (q) {
      const hay = normalize(`${test.name} ${test.time} ${test.group ?? ''}`)
      if (!hay.includes(q)) return false
    }
    if (activeTab === 'الكل' || !activeTab) return true
    return test.group === activeTab
  })

  return (
    <Card className="p-5 sm:p-7 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="icon" className="w-6 h-6" />
        <h3 className="text-lg sm:text-xl font-black text-slate-800">الفحوصات المتوفرة</h3>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={searchRaw}
          onChange={(e) => setSearchRaw(e.target.value)}
          placeholder="ابحث عن الفحص..."
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
        {filtered.map((test, i) => (
          <div
            key={`${test.name}-${i}`}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 bg-white hover:border-blue-50 transition-all cursor-default"
          >
            <img src={test.icon} alt={test.name} className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" />
            
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-[14px] sm:text-[15px] font-black text-slate-800 truncate">{test.name}</span>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                <Clock size={12} />
                <span>{test.time}</span>
              </div>
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
