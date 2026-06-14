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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: '24px',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <h2
            className="hsp-page-title"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(22px, 3vw, 42px)',
              color: '#1a2d4a',
              margin: '0',
              lineHeight: '1.15',
              textAlign: 'right',
              width: '100%',
            }}
          >
            دليلك الصحي في أوقات الحاجة
          </h2>

          <div 
            className="header-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              gap: '12px'
            }}
          >
            <p
              className="hsp-subtitle"
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 500,
                fontSize: '15px',
                color: '#000',
                margin: 0,
                textAlign: 'right',
                lineHeight: '1.6',
                flex: 1,
              }}
            >
              نقدم لك إرشادات موثوقة للإسعافات الأولية والتوعية الصحية والدعم النفسي لضمان سلامتك وسلامة عائلتك في جميع الظروف.
            </p>
          </div>
        </div>

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
