'use client'

import { Search, Filter, Menu } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import FacilityCard from '@/components/health/FacilityCard'
import { useHealthFacilities } from '@/hooks/useHealthFacilities'
import Image from 'next/image'
import {
  CATEGORY_LABELS,
  type FacilityCategory,
  type HealthFacility,
} from '@/schemas/healthFacility'

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data, isLoading } = useHealthFacilities({
    category: activeCategory,
    search: debouncedSearch,
  })

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    clearTimeout((handleSearchChange as any)._t)
    ;(handleSearchChange as any)._t = setTimeout(
      () => setDebouncedSearch(value),
      350,
    )
  }, [])

  const handleNavigate = (_facility: HealthFacility) => {
    // TODO: open facility details
  }

  const handleCall = (_facility: HealthFacility) => {
    // TODO: initiate call
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        direction: 'rtl',
        fontFamily: "'Cairo', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Responsive grid styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .health-grid {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 20px;
            }
            @media (max-width: 1280px) {
              .health-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            @media (max-width: 640px) {
              .health-grid { grid-template-columns: minmax(0, 1fr); }
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .filter-dropdown {
              animation: slideDown 0.2s ease-out forwards;
              transform-origin: top right;
            }
            @media (max-width: 768px) {
              .header-row {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 16px !important;
              }
              .map-btn {
                width: 100% !important;
                justify-content: center !important;
              }
              .search-filter-row {
                flex-direction: column !important;
              }
              .filter-dropdown-container {
                width: 100% !important;
              }
              .filter-btn {
                width: 100% !important;
              }
            }
          `,
        }}
      />

      {/* ── Mobile Navbar (Matches Dashboard) ── */}
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

      {/* ── Header ── */}
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
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(28px, 3vw, 42px)',
            color: '#1a2d4a',
            margin: '0',
            lineHeight: '1.15',
            textAlign: 'right',
          }}
        >
          الخدمات الصحية
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
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 500,
              fontSize: '16px',
              color: '#000',
              margin: 0,
              textAlign: 'right',
              lineHeight: '1.6',
              flex: 1,
            }}
          >
            ابحث عن أقرب مراكز الرعاية الصحية وتأكد من توفر الأدوية في الوقت الفعلي
          </p>

          {/* Map button */}
          <button
            className="map-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 44px',
              background: '#2196F3',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 600,
              fontSize: '15px',
              color: '#fff',
              flexShrink: 0,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#1976D2')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#2196F3')
            }
          >
            عرض الخريطة
          </button>
        </div>
      </div>

      {/* ── Filter Container ── */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '16px 24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '2px solid #e5e7eb',
        marginBottom: '24px',
        flexShrink: 0,
      }}>
        {/* ── Category tabs ── */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderBottom: '1.5px solid rgba(126,125,125,0.18)',
            marginBottom: '16px',
            overflowX: 'auto',
          }}
        >
          {CATEGORIES.map(([key, label]) => {
            const isActive = activeCategory === key
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  padding: '6px 24px 10px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive
                    ? '3px solid #2196F3'
                    : '3px solid transparent',
                  cursor: 'pointer',
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '15px',
                  color: isActive ? '#F59E0B' : '#7E7D7D',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  marginBottom: '-1.5px',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* ── Search + Filter ── */}
        <div
          className="search-filter-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            direction: 'rtl',
          }}
        >
          {/* Search bar */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(217,217,217,0.38)',
              borderRadius: '8px',
              padding: '10px 14px',
              width: '100%'
            }}
          >
            <Search size={18} color="#2196F3" style={{ flexShrink: 0 }} />
            <Input
              value={searchValue}
              placeholder="ابحث عن الخدمات, المستشفيات, أو مراكز الإيواء..."
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
                color: '#555',
                textAlign: 'right',
                direction: 'rtl',
                padding: 0,
              }}
            />
          </div>

          {/* Filter button */}
          <div className="filter-dropdown-container" style={{ position: 'relative' }}>
            <button
              className="filter-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 48px',
                background: '#2196F3',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                color: '#fff',
                minWidth: '160px',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = '#1976D2')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = '#2196F3')
              }
            >
              <Filter size={16} color="#fff" />
              {selectedRegion === 'north' ? 'في الشمال' : selectedRegion === 'south' ? 'في الجنوب' : 'فلترة'}
            </button>

            {showFilterDropdown && (
              <div
                className="filter-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  left: 0,
                  marginTop: '12px',
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '1px solid #d1d5db',
                  zIndex: 100,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <button
                  onClick={() => {
                    setSelectedRegion('north')
                    setShowFilterDropdown(false)
                  }}
                  style={{
                    padding: '12px 16px',
                    background: selectedRegion === 'north' ? '#e3f2fd' : 'transparent',
                    border: 'none',
                    textAlign: 'right',
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    color: selectedRegion === 'north' ? '#2196F3' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  في الشمال
                </button>
                <div style={{ height: '1px', background: '#e5e7eb', margin: '0 12px' }} />
                <button
                  onClick={() => {
                    setSelectedRegion('south')
                    setShowFilterDropdown(false)
                  }}
                  style={{
                    padding: '12px 16px',
                    background: selectedRegion === 'south' ? '#e3f2fd' : 'transparent',
                    border: 'none',
                    textAlign: 'right',
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    color: selectedRegion === 'south' ? '#2196F3' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  في الجنوب
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cards grid ── */}
      {isLoading ? (
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
      ) : !data?.facilities?.length ? (
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
      ) : (
        <div
          className="health-grid custom-scrollbar"
          style={{
            overflowY: 'auto',
            paddingBottom: '28px',
            flex: 1,
            alignContent: 'start',
          }}
        >
          {data.facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onNavigate={handleNavigate}
              onCall={handleCall}
            />
          ))}
        </div>
      )}
    </div>
  )
}
