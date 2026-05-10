'use client'

import React from 'react'
import FacilityCard from '@/components/health/FacilityCard'
import { HealthFacility } from '@/schemas/healthFacility'

interface FacilityGridProps {
  isLoading: boolean
  facilities: HealthFacility[] | undefined
  onNavigate: (facility: HealthFacility) => void
  onCall: (facility: HealthFacility) => void
}

export default function FacilityGrid({
  isLoading,
  facilities,
  onNavigate,
  onCall,
}: FacilityGridProps) {
  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7E7D7D',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 600,
          fontSize: '16px',
        }}
      >
        جارٍ التحميل...
      </div>
    )
  }

  if (!facilities?.length) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9E9E9E',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 600,
          fontSize: '15px',
        }}
      >
        لا توجد نتائج
      </div>
    )
  }

  return (
    <div
      className="health-grid custom-scrollbar"
      style={{
        overflowY: 'auto',
        paddingBottom: '28px',
        flex: 1,
        alignContent: 'start',
      }}
    >
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
          onNavigate={onNavigate}
          onCall={onCall}
        />
      ))}
    </div>
  )
}
