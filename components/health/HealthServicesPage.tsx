'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import {
  HEALTH_ROUTE,
  healthFacilityOrdinalPath,
  parseOrdinalRouteParam,
  resolveFacilityByOrdinal,
  sortHealthFacilitiesStable,
} from '@/lib/health/healthFacilityRoutes'
import { useDashboardShell } from '@/components/dashboard/DashboardShellContext'
import { useHealthFacilities } from '@/hooks/useHealthFacilities'
import { useHealthFacilityLiveDetail } from '@/hooks/useHealthFacilityLiveDetail'
import { precacheTilesForPoint } from '@/lib/pwa/mapTileCache'
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

function StalenessIndicator({ cachedAt }: { cachedAt: number }) {
  const [now, setNow] = useState<number>(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now())
    }, 60_000)
    return () => clearInterval(id)
  }, [])
  const minutes = Math.floor((now - cachedAt) / 60_000)
  const label = minutes < 1 ? 'للتو' : `منذ ${minutes} دقيقة`
  return (
    <div
      dir="rtl"
      style={{
        background: '#FFF3CD',
        border: '1px solid #FFC107',
        borderRadius: 8,
        padding: '6px 12px',
        margin: '8px 0',
        fontSize: 13,
        color: '#856404',
      }}
    >
      ⚠ البيانات محلية — آخر تحديث {label}
    </div>
  )
}

function numericRouteId(value?: string | null): string | undefined {
  return value && /^\d+$/.test(value) ? value : undefined
}

function pathnameFacilityId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const segments = window.location.pathname.split('/').filter(Boolean)
  return numericRouteId(segments[segments.length - 1])
}

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
  const routeParams = useParams<{ id?: string }>()
  const urlSearch = searchParams ? (searchParams.get('search') || '') : ''

  const effectiveFacilityId = useMemo(
    () => facilityId ?? numericRouteId(routeParams?.id) ?? pathnameFacilityId(),
    [facilityId, routeParams?.id],
  )

  const shell = useDashboardShell()
  const openMobileMenu = setIsMobileMenuOpen ?? shell?.setIsMobileMenuOpen
  const [searchValue, setSearchValue] = useState(urlSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<'north' | 'south' | null>(null)

  const [view, setView] = useState<
    'list' | 'detail' | 'map' | 'doctors' | 'medicines'
  >(() => (effectiveFacilityId ? 'detail' : 'list'))
  const currentView = effectiveFacilityId && view === 'list' ? 'detail' : view
  const [prevView, setPrevView] = useState<'list' | 'detail' | 'doctors' | 'medicines'>('detail')
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [])

  const listQueryParams = useMemo(
    () => ({
      category,
      search: effectiveFacilityId ? '' : debouncedSearch,
      region: effectiveFacilityId ? null : selectedRegion,
    }),
    [category, effectiveFacilityId, debouncedSearch, selectedRegion],
  )

  const handleCategoryChange = useCallback(
    (next: FacilityCategory) => {
      if (next === category) return
      openMobileMenu?.(false)
      router.push(HEALTH_ROUTE[next])
    },
    [router, category, openMobileMenu],
  )

  const { data, catalog, isLoading, isError, error, refetch, isBackgroundRefreshing, cachedAt } =
    useHealthFacilities(listQueryParams)

  const routeOrdinal = effectiveFacilityId ? parseOrdinalRouteParam(effectiveFacilityId) : null

  const routeFacility = useMemo(() => {
    if (routeOrdinal == null || !catalog?.facilities?.length) return null
    return resolveFacilityByOrdinal(catalog.facilities, routeOrdinal)
  }, [routeOrdinal, catalog])

  const effectiveFacility = routeFacility ?? selectedFacility

  const showLiveDetail =
    Boolean(effectiveFacility) &&
    (currentView === 'detail' ||
      currentView === 'map' ||
      currentView === 'doctors' ||
      currentView === 'medicines')

  const { facility: liveFacility } = useHealthFacilityLiveDetail(
    category,
    effectiveFacility,
    { enabled: showLiveDetail },
  )

  const displayFacility = liveFacility ?? effectiveFacility

  useEffect(() => {
    if (displayFacility?.latitude == null || displayFacility.longitude == null) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    void precacheTilesForPoint(
      displayFacility.latitude,
      displayFacility.longitude,
      [14, 15, 16],
      1,
    )
  }, [displayFacility?.latitude, displayFacility?.longitude])

  const goToFacilityList = useCallback(() => {
    setSelectedFacility(null)
    setView('list')
    if (typeof window !== 'undefined') {
      window.location.href = HEALTH_ROUTE[category]
    } else {
      router.push(HEALTH_ROUTE[category])
    }
  }, [router, category, setSelectedFacility, setView])

  const handleHealthHeaderMap = useCallback(() => {
    const first = data?.facilities?.[0]
    if (!first) return
    setSelectedFacility(first)
    setPrevView('list')
    setView('map')
  }, [data?.facilities, setSelectedFacility, setPrevView, setView])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = setTimeout(() => {
        searchDebounceRef.current = null
        setDebouncedSearch(value)
      }, 350)
    },
    [setSearchValue, setDebouncedSearch],
  )

  const handleNavigate = useCallback(
    (facility: HealthFacility) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setSelectedFacility(facility)
        setPrevView('list')
        setView('detail')
        return
      }

      const base = catalog?.facilities?.length
        ? sortHealthFacilitiesStable(catalog.facilities)
        : data?.facilities?.length
          ? sortHealthFacilitiesStable(data.facilities)
          : []
      const idx = base.findIndex((f) => f.id === facility.id)
      if (idx < 0) return
      router.push(healthFacilityOrdinalPath(category, idx + 1))
    },
    [
      catalog,
      data,
      category,
      router,
      setSelectedFacility,
      setPrevView,
      setView,
    ],
  )

  const handleCall = (facility: HealthFacility) => {
    const n = facility.phone?.replace(/\s/g, '')
    if (n) window.location.href = `tel:${n}`
  }

  if (effectiveFacilityId && routeOrdinal === null) {
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

  if (effectiveFacilityId && isError) {
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

  if (effectiveFacilityId && (isLoading || catalog === undefined)) {
    return (
      <div
        className="health-page-container p-10 text-center text-gray-500"
        dir="rtl"
      >
        جارٍ التحميل...
      </div>
    )
  }

  if (effectiveFacilityId && catalog && !routeFacility && isBackgroundRefreshing) {
    return (
      <div className="health-page-container p-10 text-center" dir="rtl">
        <p style={{ color: '#64748b', marginBottom: 16, fontWeight: 600 }}>
          الاتصال بطيء، نحاول تحميل بيانات المنشأة...
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

  if (effectiveFacilityId && catalog && !routeFacility) {
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

  if (currentView === 'detail' && displayFacility) {
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

  if (currentView === 'map' && displayFacility) {
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

  if (currentView === 'doctors' && displayFacility) {
    return (
      <AllDoctorsView 
        hospital={displayFacility} 
        onBack={() => setView('detail')}
        onShowMap={() => { setPrevView('doctors'); setView('map'); }}
      />
    )
  }

  if (currentView === 'medicines' && displayFacility) {
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

      {cachedAt && <StalenessIndicator cachedAt={cachedAt} />}

      <FacilityGrid 
        isLoading={isLoading}
        facilities={data?.facilities}
        queryError={isError ? error : undefined}
        onRetry={() => refetch()}
        isBackgroundRefreshing={isBackgroundRefreshing}
        onNavigate={handleNavigate}
        onCall={handleCall}
      />
    </div>
  )
}
