'use client'

import React from 'react'
import HospitalDetailFooter from '../sections/HospitalDetailFooter'
import LabHeader from './sections/LabHeader'
import LabTestsSection from './sections/LabTestsSection'
import LabSidebar from './sections/LabSidebar'
import LocationContactCard from '../pharmacy/sections/LocationContactCard'
import type { HealthFacility } from '@/schemas/healthFacility'

import '../../health.css'

interface LabDetailViewProps {
  lab: HealthFacility
  onBack: () => void
  onShowMap: () => void
}

export default function LabDetailView({ lab, onBack, onShowMap }: LabDetailViewProps) {
  const updated = lab.detail?.lastUpdatedAt ?? '29/3/2026'

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#f8fafc' }}>
      
      <div className="flex-1 px-4 sm:px-6 pt-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <LabHeader lab={lab} onShowMap={onShowMap} />
            
            <div className="lg:hidden">
              <LocationContactCard facility={lab} />
            </div>

            <LabTestsSection
              tests={lab.detail?.labTests}
              tabLabels={lab.detail?.labTestTabLabels}
            />
            
            <div className="bg-[#FFCD2912] border border-[#FFCD2912] p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <img src="https://api.iconify.design/solar:bell-bold.svg?color=%23FFCD29" alt="bell" className="w-5 h-5" />
                <span className="text-[#FFCD29] font-black text-[14px]">آخر تحديث للبيانات منذ</span>
              </div>
              <span className="text-[#FFCD29] font-black text-[14px]">{updated}</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <LabSidebar lab={lab} />
          </div>

        </div>
      </div>

      <HospitalDetailFooter onBack={onBack} />
    </div>
  )
}
