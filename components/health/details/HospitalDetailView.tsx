'use client'

import React from 'react'
import SharedHeroHeader from './SharedHeroHeader'
import HospitalServices from './sections/HospitalServices'
import HospitalLocation from './sections/HospitalLocation'
import HospitalDoctorsSection from './sections/HospitalDoctorsSection'
import HospitalMedicinesTable from './sections/HospitalMedicinesTable'
import HospitalWorkingHours from './sections/HospitalWorkingHours'
import HospitalDetailFooter from './sections/HospitalDetailFooter'

import type { HealthFacility } from '@/schemas/healthFacility'

import '../health.css'

interface HospitalDetailViewProps {
  hospital: HealthFacility
  onBack: () => void
  onShowMap: () => void
  onShowAllDoctors: () => void
  onShowAllMedicines: () => void
  onCall?: () => void
}

export default function HospitalDetailView({
  hospital,
  onBack,
  onShowMap,
  onShowAllDoctors,
  onShowAllMedicines,
  onCall,
}: HospitalDetailViewProps) {
  const d = hospital.detail

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff' }}>
      
      <div className="flex-1 flex flex-col gap-4 pb-6 px-1">
        <SharedHeroHeader hospital={hospital} onShowMap={onShowMap} onCall={onCall} />

        <div className="hdv-mid-grid">
          <HospitalServices services={d?.hospitalServices} />
          <HospitalLocation hospital={hospital} />
        </div>

        <HospitalDoctorsSection onShowAll={onShowAllDoctors} doctors={d?.doctors} />

        <div className="hdv-bottom-grid">
          <HospitalMedicinesTable
            onShowAll={onShowAllMedicines}
            medicines={d?.medicines}
            medicinesAll={d?.medicinesAll}
          />
          <HospitalWorkingHours workingHours={d?.workingHours} />
        </div>
      </div>

      <HospitalDetailFooter onBack={onBack} />
    </div>
  )
}
