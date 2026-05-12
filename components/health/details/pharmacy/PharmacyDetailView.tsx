'use client'

import React from 'react'
import HospitalDetailFooter from '../sections/HospitalDetailFooter'
import PharmacyHeader from './sections/PharmacyHeader'
import PharmacyMedicineTypes from './sections/PharmacyMedicineTypes'
import PharmacyMedicalSupplies from './sections/PharmacyMedicalSupplies'
import PharmacySidebar from './sections/PharmacySidebar'
import LocationContactCard from './sections/LocationContactCard'
import type { HealthFacility } from '@/schemas/healthFacility'

import '../../health.css'

interface PharmacyDetailViewProps {
  pharmacy: HealthFacility
  onBack: () => void
  onShowMap: () => void
}

export default function PharmacyDetailView({ pharmacy, onBack, onShowMap }: PharmacyDetailViewProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative pb-4" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#f8fafc' }}>
      
      <div className="flex-1 px-4 sm:px-6 pt-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <PharmacyHeader pharmacy={pharmacy} onShowMap={onShowMap} />

            <div className="lg:hidden">
              <LocationContactCard facility={pharmacy} />
            </div>

            <PharmacyMedicineTypes types={pharmacy.detail?.pharmacyMedicineTypes} />
            <PharmacyMedicalSupplies supplies={pharmacy.detail?.pharmacySupplies} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <PharmacySidebar pharmacy={pharmacy} />
          </div>

        </div>
      </div>

      <HospitalDetailFooter onBack={onBack} />
    </div>
  )
}
