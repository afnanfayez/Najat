'use client'

import React from 'react'
import SharedHeroHeader from './SharedHeroHeader'
import HospitalServices from './sections/HospitalServices'
import HospitalLocation from './sections/HospitalLocation'
import HospitalDoctorsSection from './sections/HospitalDoctorsSection'
import HospitalMedicinesTable from './sections/HospitalMedicinesTable'
import HospitalWorkingHours from './sections/HospitalWorkingHours'
import HospitalDetailFooter from './sections/HospitalDetailFooter'

import '../health.css'

interface HospitalDetailViewProps {
  hospital: any
  onBack: () => void
  onShowMap: () => void
  onShowAllDoctors: () => void
  onShowAllMedicines: () => void
}

export default function HospitalDetailView({ 
  hospital, 
  onBack, 
  onShowMap, 
  onShowAllDoctors, 
  onShowAllMedicines 
}: HospitalDetailViewProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-2 relative" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#fff' }}>
      <SharedHeroHeader hospital={hospital} onShowMap={onShowMap} />

      <div className="hdv-mid-grid px-1">
        <HospitalServices />
        <HospitalLocation hospital={hospital} />
      </div>

      <HospitalDoctorsSection onShowAll={onShowAllDoctors} />

      <div className="hdv-bottom-grid px-1">
        <HospitalMedicinesTable onShowAll={onShowAllMedicines} />
        <HospitalWorkingHours />
      </div>

      <HospitalDetailFooter onBack={onBack} />
    </div>
  )
}
