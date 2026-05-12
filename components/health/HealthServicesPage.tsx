'use client'

import { Menu } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useHealthFacilities } from '@/hooks/useHealthFacilities'
import {
  CATEGORY_LABELS,
  type FacilityCategory,
  type HealthFacility,
} from '@/schemas/healthFacility'

import HospitalDetailView from './details/HospitalDetailView'
import PharmacyDetailView from './details/pharmacy/PharmacyDetailView'
import LabDetailView from './details/lab/LabDetailView'
import DentalDetailView from './details/dental/DentalDetailView'
import ClinicDetailView from './details/clinic/ClinicDetailView'
import ClinicAllMedicinesView from './details/clinic/ClinicAllMedicinesView'
import HospitalMapView from './details/HospitalMapView'
import PharmacyMapView from './details/pharmacy/PharmacyMapView'
import LabMapView from './details/lab/LabMapView'
import DentalMapView from './details/dental/DentalMapView'
import ClinicMapView from './details/clinic/ClinicMapView'
import AllDoctorsView from './details/AllDoctorsView'
import AllMedicinesView from './details/AllMedicinesView'

import HealthHeader from './layout/HealthHeader'
import HealthFilter from './layout/HealthFilter'
import FacilityGrid from './layout/FacilityGrid'

import './health.css'

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [FacilityCategory, string][]

interface HealthServicesPageProps {
  setIsMobileMenuOpen?: (open: boolean) => void
}

export default function HealthServicesPage({ setIsMobileMenuOpen }: HealthServicesPageProps) {
  const [activeCategory, setActiveCategory] = useState<FacilityCategory>('hospitals')
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<'north' | 'south' | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const [view, setView] = useState<'list' | 'detail' | 'map' | 'doctors' | 'medicines'>('list')
  const [prevView, setPrevView] = useState<'list' | 'detail' | 'doctors' | 'medicines'>('detail')
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data, isLoading, isError, error, refetch } = useHealthFacilities({
    category: activeCategory,
    search: debouncedSearch,
    region: selectedRegion,
  })

  const handleHealthHeaderMap = useCallback(() => {
    const first = data?.facilities?.[0]
    if (!first) return
    setSelectedFacility(first)
    setPrevView('list')
    setView('map')
  }, [data?.facilities])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    clearTimeout((handleSearchChange as any)._t)
    ;(handleSearchChange as any)._t = setTimeout(
      () => setDebouncedSearch(value),
      350,
    )
  }, [])

  const handleNavigate = (facility: HealthFacility) => {
    setSelectedFacility(facility)
    setView('detail')
  }

  const handleCall = (facility: HealthFacility) => {
    const n = facility.phone?.replace(/\s/g, '')
    if (n) window.location.href = `tel:${n}`
  }

  if (view === 'detail' && selectedFacility) {
    if (activeCategory === 'hospitals') {
      return (
        <HospitalDetailView 
          hospital={selectedFacility} 
          onBack={() => setView('list')} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
          onShowAllDoctors={() => setView('doctors')}
          onShowAllMedicines={() => setView('medicines')}
          onCall={() => handleCall(selectedFacility)}
        />
      )
    }
    
    if (activeCategory === 'pharmacies') {
      return (
        <PharmacyDetailView 
          pharmacy={selectedFacility} 
          onBack={() => setView('list')} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
        />
      )
    }

    if (activeCategory === 'labs') {
      return (
        <LabDetailView 
          lab={selectedFacility} 
          onBack={() => setView('list')} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
        />
      )
    }

    if (activeCategory === 'dental') {
      return (
        <DentalDetailView 
          clinic={selectedFacility} 
          onBack={() => setView('list')} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
        />
      )
    }

    if (activeCategory === 'clinics') {
      return (
        <ClinicDetailView 
          clinic={selectedFacility} 
          onBack={() => setView('list')} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
          onShowAllMedicines={() => setView('medicines')}
        />
      )
    }

    return (
      <div className="p-10 text-center font-bold">
        جاري العمل على تفاصيل هذا القسم...
        <button onClick={() => setView('list')} className="block mx-auto mt-4 text-blue-500 underline">رجوع</button>
      </div>
    )
  }

  if (view === 'map' && selectedFacility) {
    if (activeCategory === 'pharmacies') {
      return (
        <PharmacyMapView 
          pharmacy={selectedFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }
    if (activeCategory === 'labs') {
      return (
        <LabMapView 
          lab={selectedFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }
    if (activeCategory === 'dental') {
      return (
        <DentalMapView 
          clinic={selectedFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }

    if (activeCategory === 'clinics') {
      return (
        <ClinicMapView 
          clinic={selectedFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }

    return (
      <HospitalMapView 
        hospital={selectedFacility} 
        onBack={() => setView(prevView)} 
      />
    )
  }

  if (view === 'doctors' && selectedFacility) {
    return (
      <AllDoctorsView 
        hospital={selectedFacility} 
        onBack={() => setView('detail')}
        onShowMap={() => { setPrevView('doctors'); setView('map'); }}
      />
    )
  }

  if (view === 'medicines' && selectedFacility) {
    if (activeCategory === 'clinics') {
      return (
        <ClinicAllMedicinesView 
          clinic={selectedFacility} 
          onBack={() => setView('detail')}
          onShowMap={() => { setPrevView('medicines'); setView('map'); }}
        />
      )
    }
    return (
      <AllMedicinesView 
        hospital={selectedFacility} 
        onBack={() => setView('detail')}
        onShowMap={() => { setPrevView('medicines'); setView('map'); }}
      />
    )
  }

  return (
    <div className="health-page-container">
      {isMobile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #e8eef5',
            marginBottom: '20px',
            flexShrink: 0,
          }}
        >
          <div 
            style={{ color: '#2196F3', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen?.(true)}
          >
            <Menu size={32} />
          </div>
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            <Image
              src="/assets/Logo2.png"
              alt="شعار نجاة"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
      )}

      <HealthHeader onShowMap={handleHealthHeaderMap} />

      <HealthFilter 
        categories={CATEGORIES}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        showFilterDropdown={showFilterDropdown}
        setShowFilterDropdown={setShowFilterDropdown}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      <FacilityGrid 
        isLoading={isLoading}
        facilities={data?.facilities}
        queryError={isError ? error : undefined}
        onRetry={() => refetch()}
        onNavigate={handleNavigate}
        onCall={handleCall}
      />
    </div>
  )
}
