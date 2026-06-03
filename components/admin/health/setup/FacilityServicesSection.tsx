'use client'

import { Check } from 'lucide-react'
import SetupSectionCard from './SetupSectionCard'
import { FACILITY_SERVICES } from './setupConstants'
import { SETUP_BLUE, SETUP_FONT } from './setupStyles'

interface FacilityServicesSectionProps {
  selected: string[]
  onToggle: (id: string) => void
}

export default function FacilityServicesSection({
  selected,
  onToggle,
}: FacilityServicesSectionProps) {
  return (
    <SetupSectionCard title="خدمات المنشأة" className="w-full">
      <div className="flex w-full flex-wrap justify-start gap-2 sm:gap-3">
        {FACILITY_SERVICES.map((service) => {
          const active = selected.includes(service.id)
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onToggle(service.id)}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-all sm:gap-2 sm:px-5 sm:py-3 sm:text-base lg:text-lg"
              style={{
                fontFamily: SETUP_FONT,
                background: active ? SETUP_BLUE : '#fff',
                color: active ? '#fff' : SETUP_BLUE,
                border: active ? 'none' : `1.5px solid ${SETUP_BLUE}`,
              }}
            >
              {active && <Check size={18} strokeWidth={3} />}
              {service.label}
            </button>
          )
        })}
      </div>
    </SetupSectionCard>
  )
}
