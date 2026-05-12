'use client'

import React from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FacilityCategory } from '@/schemas/healthFacility'

interface HealthFilterProps {
  categories: [FacilityCategory, string][]
  activeCategory: FacilityCategory
  setActiveCategory: (category: FacilityCategory) => void
  searchValue: string
  onSearchChange: (value: string) => void
  showFilterDropdown: boolean
  setShowFilterDropdown: (show: boolean) => void
  selectedRegion: 'north' | 'south' | null
  setSelectedRegion: (region: 'north' | 'south' | null) => void
}

export default function HealthFilter({
  categories,
  activeCategory,
  setActiveCategory,
  searchValue,
  onSearchChange,
  showFilterDropdown,
  setShowFilterDropdown,
  selectedRegion,
  setSelectedRegion,
}: HealthFilterProps) {
  return (
    <div className="hsp-filter-box" style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '16px 24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '2px solid #e5e7eb',
      marginBottom: '24px',
      flexShrink: 0,
    }}>
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
        {categories.map(([key, label]) => {
          const isActive = activeCategory === key
          return (
            <button
              key={key}
              className="hsp-tab"
              onClick={() => setActiveCategory(key)}
              style={{
                padding: '6px 20px 10px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive
                  ? '3px solid #2196F3'
                  : '3px solid transparent',
                cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif",
                fontWeight: isActive ? 700 : 500,
                fontSize: '14px',
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

      <div
        className="search-filter-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          direction: 'rtl',
        }}
      >
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
            placeholder="ابحث باسم المنشأة، الدواء، الطبيب، التخصص، أو نوع الخدمة..."
            onChange={(e) => onSearchChange(e.target.value)}
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
            {selectedRegion === 'north'
              ? 'في الشمال'
              : selectedRegion === 'south'
                ? 'في الجنوب'
                : 'فلترة المنطقة'}
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
                  setSelectedRegion(null)
                  setShowFilterDropdown(false)
                }}
                style={{
                  padding: '12px 16px',
                  background: selectedRegion === null ? '#e3f2fd' : 'transparent',
                  border: 'none',
                  textAlign: 'right',
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  color: selectedRegion === null ? '#2196F3' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                كل المناطق
              </button>
              <div style={{ height: '1px', background: '#e5e7eb', margin: '0 12px' }} />
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
  )
}
