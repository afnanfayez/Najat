'use client'

import { Menu } from 'lucide-react'
import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  HEALTH_ROUTE,
  healthFacilityOrdinalPath,
  parseOrdinalRouteParam,
  resolveFacilityByOrdinal,
  sortHealthFacilitiesStable,
} from '@/lib/health/healthFacilityRoutes'
import { useDashboardShell } from '@/components/dashboard/DashboardShellContext'
import Image from 'next/image'
import { useHealthFacilities } from '@/hooks/useHealthFacilities'
import { useHealthFacilityLiveDetail } from '@/hooks/useHealthFacilityLiveDetail'
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
  category: FacilityCategory
  /** رقم ترتيبي 1…n في المسار (مثل `/hospitals/3`)، وليس UUID */
  facilityId?: string
  setIsMobileMenuOpen?: (open: boolean) => void
}

export default function HealthServicesPage({
  category,
  facilityId,
  setIsMobileMenuOpen,
}: HealthServicesPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSearch = searchParams ? (searchParams.get('search') || '') : ''

  const shell = useDashboardShell()
  const openMobileMenu = setIsMobileMenuOpen ?? shell?.setIsMobileMenuOpen
  const [searchValue, setSearchValue] = useState(urlSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch)

  useEffect(() => {
    setSearchValue(urlSearch)
    setDebouncedSearch(urlSearch)
  }, [urlSearch])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<'north' | 'south' | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const [view, setView] = useState<
    'list' | 'detail' | 'map' | 'doctors' | 'medicines'
  >(() => (facilityId ? 'detail' : 'list'))
  const [prevView, setPrevView] = useState<'list' | 'detail' | 'doctors' | 'medicines'>('detail')
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const listQueryParams = useMemo(
    () => ({
      category,
      search: facilityId ? '' : debouncedSearch,
      region: facilityId ? null : selectedRegion,
    }),
    [category, facilityId, debouncedSearch, selectedRegion],
  )

  const handleCategoryChange = useCallback(
    (next: FacilityCategory) => {
      if (next === category) return
      openMobileMenu?.(false)
      router.push(HEALTH_ROUTE[next])
    },
    [router, category, openMobileMenu],
  )

  const { data, isLoading, isError, error, refetch } =
    useHealthFacilities(listQueryParams)

  const { data: indexData, isLoading: indexLoading } = useHealthFacilities({
    category,
    search: '',
    region: null,
  })

  const routeOrdinal = facilityId ? parseOrdinalRouteParam(facilityId) : null

  const routeFacility = useMemo(() => {
    if (routeOrdinal == null || !data?.facilities?.length) return null
    return resolveFacilityByOrdinal(data.facilities, routeOrdinal)
  }, [routeOrdinal, data])

  const effectiveFacility = routeFacility ?? selectedFacility

  const showLiveDetail =
    Boolean(effectiveFacility) &&
    (view === 'detail' || view === 'map' || view === 'doctors' || view === 'medicines')

  const { facility: liveFacility } = useHealthFacilityLiveDetail(
    category,
    effectiveFacility,
    { enabled: showLiveDetail },
  )

  const displayFacility = liveFacility ?? effectiveFacility

  const goToFacilityList = useCallback(() => {
    router.push(HEALTH_ROUTE[category])
  }, [router, category])

  const handleHealthHeaderMap = useCallback(() => {
    const first = data?.facilities?.[0]
    if (!first) return
    setSelectedFacility(first)
    setPrevView('list')
    setView('map')
  }, [data?.facilities])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      searchDebounceRef.current = null
      setDebouncedSearch(value)
    }, 350)
  }, [])

  const handleNavigate = (facility: HealthFacility) => {
    const base = indexData?.facilities?.length
      ? sortHealthFacilitiesStable(indexData.facilities)
      : []
    const idx = base.findIndex((f) => f.id === facility.id)
    if (idx < 0) return
    router.push(healthFacilityOrdinalPath(category, idx + 1))
  }

  const handleCall = (facility: HealthFacility) => {
    const n = facility.phone?.replace(/\s/g, '')
    if (n) window.location.href = `tel:${n}`
  }

  if (facilityId && routeOrdinal === null) {
    return (
      <div className="health-page-container p-10 text-center" dir="rtl">
        <p style={{ fontWeight: 700, marginBottom: 16 }}>
          رقم المنشأة في الرابط غير صالح (استخدم أرقام فقط: 1، 2، 3…)
        </p>
        <button
          type="button"
          onClick={goToFacilityList}
          className="text-blue-600 underline"
        >
          رجوع للقائمة
        </button>
      </div>
    )
  }

  if (facilityId && isError) {
    return (
      <div className="health-page-container p-10 text-center" dir="rtl">
        <p style={{ color: '#f44336', marginBottom: 16, fontWeight: 600 }}>
          تعذر تحميل البيانات
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-blue-600 underline"
        >
          إعادة المحاولة
        </button>
        <button
          type="button"
          onClick={goToFacilityList}
          className="block mx-auto mt-4 text-blue-600 underline"
        >
          رجوع للقائمة
        </button>
      </div>
    )
  }

  if (facilityId && (isLoading || data === undefined)) {
    return (
      <div
        className="health-page-container p-10 text-center text-gray-500"
        dir="rtl"
      >
        جارٍ التحميل...
      </div>
    )
  }

  if (facilityId && data && !routeFacility) {
    return (
      <div className="health-page-container p-10 text-center" dir="rtl">
        <p style={{ fontWeight: 700, marginBottom: 16 }}>
          المنشأة غير موجودة أو الرقم خارج النطاق
        </p>
        <button
          type="button"
          onClick={goToFacilityList}
          className="text-blue-600 underline"
        >
          رجوع للقائمة
        </button>
      </div>
    )
  }

  if (view === 'detail' && displayFacility) {
    if (category === 'hospitals') {
      return (
        <HospitalDetailView 
          hospital={displayFacility} 
          onBack={goToFacilityList} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
          onShowAllDoctors={() => setView('doctors')}
          onShowAllMedicines={() => setView('medicines')}
          onCall={() => handleCall(displayFacility)}
        />
      )
    }
    
    if (category === 'pharmacies') {
      return (
        <PharmacyDetailView 
          pharmacy={displayFacility} 
          onBack={goToFacilityList} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
        />
      )
    }

    if (category === 'labs') {
      return (
        <LabDetailView 
          lab={displayFacility} 
          onBack={goToFacilityList} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
        />
      )
    }

    if (category === 'dental') {
      return (
        <DentalDetailView 
          clinic={displayFacility} 
          onBack={goToFacilityList} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
        />
      )
    }

    if (category === 'clinics') {
      return (
        <ClinicDetailView 
          clinic={displayFacility} 
          onBack={goToFacilityList} 
          onShowMap={() => { setPrevView('detail'); setView('map'); }}
          onShowAllMedicines={() => setView('medicines')}
        />
      )
    }

    return (
      <div className="p-10 text-center font-bold">
        جاري العمل على تفاصيل هذا القسم...
        <button onClick={goToFacilityList} className="block mx-auto mt-4 text-blue-500 underline">رجوع</button>
      </div>
    )
  }

  if (view === 'map' && displayFacility) {
    if (category === 'pharmacies') {
      return (
        <PharmacyMapView 
          pharmacy={displayFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }
    if (category === 'labs') {
      return (
        <LabMapView 
          lab={displayFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }
    if (category === 'dental') {
      return (
        <DentalMapView 
          clinic={displayFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }

    if (category === 'clinics') {
      return (
        <ClinicMapView 
          clinic={displayFacility} 
          onBack={() => setView(prevView)} 
        />
      )
    }

    return (
      <HospitalMapView 
        hospital={displayFacility} 
        onBack={() => setView(prevView)} 
      />
    )
  }

  if (view === 'doctors' && displayFacility) {
    return (
      <AllDoctorsView 
        hospital={displayFacility} 
        onBack={() => setView('detail')}
        onShowMap={() => { setPrevView('doctors'); setView('map'); }}
      />
    )
  }

  if (view === 'medicines' && displayFacility) {
    if (category === 'clinics') {
      return (
        <ClinicAllMedicinesView 
          clinic={displayFacility} 
          onBack={() => setView('detail')}
          onShowMap={() => { setPrevView('medicines'); setView('map'); }}
        />
      )
    }
    return (
      <AllMedicinesView 
        hospital={displayFacility} 
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
            onClick={() => openMobileMenu?.(true)}
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
        activeCategory={category}
        setActiveCategory={handleCategoryChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        showFilterDropdown={showFilterDropdown}
        setShowFilterDropdown={setShowFilterDropdown}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      <FacilityGrid 
        isLoading={isLoading || indexLoading}
        facilities={data?.facilities}
        queryError={isError ? error : undefined}
        onRetry={() => refetch()}
        onNavigate={handleNavigate}
        onCall={handleCall}
      />
    </div>
  )
}
