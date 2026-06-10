'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import FirstAidTab from './FirstAidTab'
import ArticlesTab from './ArticlesTab'
import MentalHealthTab from './MentalHealthTab'
const TABS = [
  { id: 'first-aid', label: 'الإسعافات الأولية' },
  { id: 'articles',  label: 'مقالات التوعية' },
  { id: 'mental',    label: 'دعم الصحة النفسية' },
]

export default function HealthGuidePage() {
  const [activeTab, setActiveTab] = useState('first-aid')
  const [query, setQuery] = useState('')

  return (
    <div
      className="flex flex-col h-full overflow-y-auto no-scrollbar pb-10 px-2"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="pt-0 text-right">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1e293b] mb-2">
          دليلك الصحي في أوقات الحاجة
        </h1>
        <p className="text-black text-[16px] sm:text-[20px] max-w-4xl font-black leading-relaxed mb-6">
          نقدم لك إرشادات موثوقة للإسعافات الأولية والتوعية الصحية والدعم النفسي لضمان سلامتك وسلامة عائلتك في جميع الظروف.
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => { setActiveTab(tab.id); setQuery('') }}
              className={`pb-3 text-[13px] sm:text-[16px] font-black whitespace-nowrap transition-all relative ${
                activeTab === tab.id ? 'text-[#F2A122]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 right-0 left-0 h-1 bg-[#2196F3] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 sm:mb-8">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2196F3]" size={20} />
          <input
            id="search-health-guide"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن الأعراض، الخطوات الإسعافية أو الدعم النفسي..."
            className="w-full border border-transparent rounded-2xl py-3.5 pr-12 pl-4 text-[13px] sm:text-[15px] font-bold focus:outline-none focus:bg-white focus:border-[#2196F31A] transition-all"
            style={{ background: '#D9D9D961' }}
          />
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'first-aid' && <FirstAidTab query={query} />}
      {activeTab === 'articles'  && <ArticlesTab query={query} />}
      {activeTab === 'mental'    && <MentalHealthTab />}
    </div>
  )
}
