'use client'

import { useState, useRef, useEffect, useCallback, FormEvent, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Lock, MapPin, Search, Loader2, Navigation, X } from 'lucide-react'
import { toast } from 'sonner'
import { useSafetyCheck, useSafetyMapData } from '@/hooks/useSafetyMapData'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import type { LeafletMapInnerProps, SearchResult } from './LeafletMapInner'

const LeafletMap = dynamic<LeafletMapInnerProps>(
  () => import('./LeafletMapInner'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e8f4fd',
          fontFamily: "'Cairo', sans-serif",
          fontSize: 18,
          color: '#2196F3',
          fontWeight: 700,
        }}
      >
        جاري تحميل الخريطة...
      </div>
    ),
  },
)

type LayerKey = 'safeRoutes' | 'dangerZones' | 'resourceActivity'

const LEGEND_ITEMS: { key: LayerKey; label: string; color: string }[] = [
  { key: 'safeRoutes', label: 'طرق آمنة', color: '#4CAF50' },
  { key: 'dangerZones', label: 'مناطق خطر', color: '#F44336' },
  { key: 'resourceActivity', label: 'نشاط الموارد', color: '#C8960C' },
]

const GAZA_VIEWBOX = '34.20,31.60,34.60,31.20'

interface NominatimItem {
  lat: string
  lon: string
  display_name: string
  name?: string
  type?: string
  class?: string
}

function shortLabel(item: NominatimItem): string {
  const parts = item.display_name.split(', ')
  if (parts.length <= 2) return item.display_name
  return parts.slice(0, 3).join('، ')
}

async function fetchSuggestions(query: string): Promise<NominatimItem[]> {
  if (!query.trim()) return []
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  async function getLocalSuggestions(q: string) {
    try {
      const { searchLocalPlaces } = await import('@/lib/offline/db')
      const locals = await searchLocalPlaces(q)
      return locals.map((l) => ({
        lat: String(l.lat),
        lon: String(l.lng),
        display_name: l.display_name,
        name: l.name,
        type: l.type,
      }))
    } catch {
      return []
    }
  }

  if (isOffline) {
    return getLocalSuggestions(query)
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '6',
      'accept-language': 'ar',
      viewbox: '34.20,31.60,34.60,31.20',
      bounded: '0',
      addressdetails: '0',
    })
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'Accept-Language': 'ar' },
    })
    if (!res.ok) return []
    return res.json()
  } catch (e) {
    console.warn('Failed to fetch map suggestions, using offline locations', e)
    return getLocalSuggestions(query)
  }
}


function ToggleSwitch({
  checked,
  onChange,
  color,
}: {
  checked: boolean
  onChange: () => void
  color: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        position: 'relative',
        width: 42,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: checked ? color : '#ccc',
        cursor: 'pointer',
        transition: 'background 0.25s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.25s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
        }}
      />
    </button>
  )
}

function InfoButton({
  label,
  color,
  icon = 'line',
}: {
  label: string
  color: string
  icon?: 'line' | 'marker'
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#fff',
        border: `2px solid ${color}`,
        borderRadius: 10,
        padding: '10px 14px',
        fontFamily: "'Cairo', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        color: '#1a2d4a',
        width: '100%',
        boxSizing: 'border-box',
        direction: 'rtl',
      }}
    >
      {icon === 'line' ? (
        <svg width="22" height="5" viewBox="0 0 22 5" style={{ flexShrink: 0 }}>
          <rect x="0" y="0" width="22" height="5" rx="2.5" fill={color} />
        </svg>
      ) : (
        <MapPin size={16} color={color} style={{ flexShrink: 0 }} />
      )}
      {label}
    </div>
  )
}

function placeIcon(item: NominatimItem): string {
  const cls = item.class ?? ''
  const type = item.type ?? ''
  if (cls === 'amenity' && (type === 'hospital' || type === 'clinic' || type === 'pharmacy' || type === 'doctors')) return '🏥'
  if (cls === 'amenity' && type === 'school') return '🏫'
  if (cls === 'amenity' && type === 'university') return '🎓'
  if (cls === 'amenity' && type === 'mosque') return '🕌'
  if (cls === 'amenity' && type === 'police') return '🚔'
  if (cls === 'highway' || type === 'road' || type === 'street') return '🛣️'
  if (cls === 'place') return '📍'
  if (cls === 'building') return '🏢'
  return '📌'
}

export default function MapsContent() {
  const { isOffline } = useOnlineStatus()
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    safeRoutes: false,
    dangerZones: false,
    resourceActivity: false,
  })
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [flyTo, setFlyTo] = useState<SearchResult | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const [isMounted, setIsMounted] = useState(false)

  const mapDataQuery = useSafetyMapData()
  const safetyCheckQuery = useSafetyCheck(
    flyTo?.coords[0] ?? null,
    flyTo?.coords[1] ?? null,
  )

  const safeRoads = mapDataQuery.data?.safeRoads ?? []
  const dangerZones = mapDataQuery.data?.dangerZones ?? []
  const resourcePoints = mapDataQuery.data?.resourcePoints ?? []

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleLayer = (key: LayerKey) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))

  const anyLayerActive = layers.safeRoutes || layers.dangerZones || layers.resourceActivity

  const bannerMessage = useMemo(() => {
    if (!isMounted) {
      return 'جاري تحميل بيانات الخريطة...'
    }
    if (flyTo && safetyCheckQuery.data && !safetyCheckQuery.data.safe) {
      const zone = safetyCheckQuery.data.zones[0]
      return zone?.description
        ? `تحذير: ${zone.description}`
        : 'تحذير: أنت في منطقة خطر — يرجى مغادرة المنطقة فوراً'
    }
    if (anyLayerActive) {
      if (isOffline) {
        return 'وضع أوفلاين: يتم عرض الطرق والمناطق المحفوظة على الجهاز'
      }
      if (mapDataQuery.isLoading) {
        return 'جاري تحميل بيانات الطبقة...'
      }
      if (mapDataQuery.isError) {
        return 'تعذّر تحميل بيانات الخريطة — تأكد من تسجيل الدخول'
      }
      if (layers.safeRoutes && safeRoads.length === 0) {
        return 'لا توجد طرق آمنة مسجلة حالياً على الخريطة'
      }
      if (layers.dangerZones && dangerZones.length === 0) {
        return 'لا توجد مناطق خطر مسجلة حالياً'
      }
      if (layers.resourceActivity && resourcePoints.length === 0) {
        return 'لا توجد نقاط موارد مسجلة حالياً'
      }
      return 'يرجى تتبع خط السير من أجل سلامتكم'
    }
    if (isOffline) {
      return 'وضع أوفلاين: فعّل طبقات الخريطة لعرض المسارات ونقاط الموارد المحفوظة'
    }
    if (mapDataQuery.isLoading) {
      return 'جاري تحميل بيانات الخريطة...'
    }
    if (mapDataQuery.isError) {
      return 'تعذّر تحميل بيانات الطرق — حاول تحديث الصفحة'
    }
    if (safeRoads.length > 0) {
      return `${safeRoads.length} طرق آمنة و${resourcePoints.length} نقاط موارد متاحة على الخريطة`
    }
    return 'فعّل طبقات الخريطة لعرض الطرق الآمنة ومناطق الخطر ونقاط الموارد'
  }, [
    isMounted,
    flyTo,
    safetyCheckQuery.data,
    anyLayerActive,
    mapDataQuery.isLoading,
    mapDataQuery.isError,
    isOffline,
    layers.safeRoutes,
    layers.dangerZones,
    layers.resourceActivity,
    safeRoads.length,
    dangerZones.length,
    resourcePoints.length,
  ])

  const bannerColor = useMemo(() => {
    if (!isMounted) return '#FF9800'
    if (flyTo && safetyCheckQuery.data && !safetyCheckQuery.data.safe) return '#F44336'
    return '#FF9800'
  }, [isMounted, flyTo, safetyCheckQuery.data])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
    setSearchError('')
    setShowDropdown(false)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length < 2) {
      setSuggestions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      const results = await fetchSuggestions(value)
      setSuggestions(results)
      setShowDropdown(results.length > 0)
      setIsSearching(false)
    }, 350)
  }, [])

  const selectSuggestion = (item: NominatimItem) => {
    setFlyTo({
      coords: [parseFloat(item.lat), parseFloat(item.lon)],
      label: item.display_name,
    })
    setQuery(shortLabel(item))
    setShowDropdown(false)
    setSuggestions([])
    setSearchError('')
  }

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    if (suggestions.length > 0) {
      selectSuggestion(suggestions[0])
      return
    }

    setIsSearching(true)
    setSearchError('')
    const results = await fetchSuggestions(q)
    if (results.length > 0) {
      selectSuggestion(results[0])
      setSuggestions(results)
    } else {
      setSearchError('لم يتم العثور على الموقع')
    }
    setIsSearching(false)
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setShowDropdown(false)
    setSearchError('')
    setFlyTo(null)
    inputRef.current?.focus()
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setSearchError('المتصفح لا يدعم تحديد الموقع')
      return
    }
    setIsLocating(true)
    setSearchError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false)
        setFlyTo({
          coords: [pos.coords.latitude, pos.coords.longitude],
          label: 'موقعك الحالي',
        })
        setQuery('موقعك الحالي')
        setShowDropdown(false)
      },
      () => {
        setIsLocating(false)
        setSearchError('تعذّر الحصول على الموقع')
      },
      { timeout: 8000 },
    )
  }

  const handleOfflineNavigation = () => {
    setLayers({
      safeRoutes: true,
      dangerZones: true,
      resourceActivity: true,
    })
    toast.info(
      isOffline
        ? 'تم تفعيل الملاحة من البيانات المحفوظة على الجهاز'
        : 'تم تفعيل طبقات الأمان والملاحة',
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      <style>{`
        .leaflet-container, .leaflet-container * { box-sizing: content-box !important; }
        .leaflet-container { font-family: 'Cairo', sans-serif; }
        .maps-search-input::placeholder { color: #b0bec5; }
        .maps-search-input:focus { outline: none; }
        .suggestion-item:hover { background: #f0f7ff !important; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Mobile responsive overrides ── */
        @media (max-width: 768px) {
          .maps-search-wrapper {
            width: calc(100vw - 32px) !important;
            left: 16px !important;
            top: 12px !important;
          }
          .maps-legend {
            min-width: 0 !important;
            padding: 10px 12px !important;
            gap: 8px !important;
            bottom: 16px !important;
            left: 12px !important;
            right: 12px !important;
            width: auto !important;
          }
          .maps-legend span { font-size: 12px !important; }
          .maps-right-panel {
            right: 12px !important;
            left: 12px !important;
            bottom: auto !important;
            top: 72px !important;
            min-width: 0 !important;
            max-width: none !important;
            width: auto !important;
            padding: 10px !important;
            gap: 8px !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
          .maps-right-panel > div {
            padding: 8px 10px !important;
            font-size: 12px !important;
            width: auto !important;
            flex: 1 1 calc(50% - 4px) !important;
            min-width: 140px !important;
          }
          .maps-banner {
            font-size: 11px !important;
            padding: 8px 14px !important;
            bottom: 120px !important;
            max-width: calc(100vw - 30px) !important;
            white-space: normal !important;
            line-height: 1.4 !important;
          }
        }

        @media (max-width: 480px) {
          .maps-legend {
            flex-direction: column !important;
            max-height: 38vh !important;
            overflow-y: auto !important;
          }
          .maps-right-panel > div {
            flex: 1 1 100% !important;
          }
          .maps-banner {
            bottom: 150px !important;
          }
        }
      `}</style>

      {/* ── Map area — fills remaining height ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>

        {/* Leaflet map */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <LeafletMap
            showSafeRoutes={layers.safeRoutes}
            showDangerZones={layers.dangerZones}
            showResourceActivity={layers.resourceActivity}
            flyTo={flyTo}
            safeRoads={safeRoads}
            dangerZones={dangerZones}
            resourcePoints={resourcePoints}
          />
        </div>

        {/* ── Search bar ── */}
        <div
          className="maps-search-wrapper"
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            width: 300,
          }}
        >
          <form onSubmit={handleSearch}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                borderRadius: showDropdown && suggestions.length > 0 ? '12px 12px 0 0' : 12,
                boxShadow: '0 2px 14px rgba(0,0,0,0.18)',
                padding: '4px 6px 4px 10px',
                gap: 6,
                border: searchError ? '1.5px solid #F44336' : '1.5px solid transparent',
                transition: 'border-color 0.2s, border-radius 0.15s',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="ابحث عن مستشفى، مسجد، شارع..."
                dir="rtl"
                className="maps-search-input"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                autoComplete="off"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: '#1a2d4a',
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  minWidth: 0,
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    color: '#aaa',
                  }}
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {isSearching
                  ? <Loader2 size={18} color="#FF9800" style={{ animation: 'spin 1s linear infinite' }} />
                  : <Search size={18} color="#FF9800" />
                }
              </button>
              <button
                type="button"
                onClick={handleOfflineNavigation}
                style={{
                  background: '#2196F3',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                }}
              >
                <Lock size={16} color="#fff" />
              </button>
            </div>
          </form>

          {/* Suggestions dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              style={{
                background: '#fff',
                borderRadius: '0 0 12px 12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                animation: 'dropIn 0.15s ease',
                borderTop: '1px solid #f0f0f0',
                marginTop: -6,
              }}
            >
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => selectSuggestion(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderBottom: i < suggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                    background: '#fff',
                    transition: 'background 0.15s',
                    direction: 'rtl',
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{placeIcon(item)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#1a2d4a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {shortLabel(item)}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: 11,
                        color: '#90a4ae',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.display_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchError && (
            <div
              style={{
                background: 'rgba(244,67,54,0.1)',
                color: '#F44336',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                textAlign: 'right',
                direction: 'rtl',
              }}
            >
              {searchError}
            </div>
          )}

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FF9800',
              fontFamily: "'Cairo', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              cursor: isLocating ? 'wait' : 'pointer',
              textDecoration: 'underline',
              padding: '0 4px',
              direction: 'rtl',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              opacity: isLocating ? 0.7 : 1,
              alignSelf: 'flex-end',
            }}
          >
            {isLocating
              ? <Loader2 size={12} color="#FF9800" style={{ animation: 'spin 1s linear infinite' }} />
              : <Navigation size={12} color="#FF9800" />
            }
            استخدام موقعك الحالي
          </button>
        </div>

        {/* ── Notification / safety banner ── */}
        <div
          className="maps-banner"
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            background: bannerColor,
            color: '#fff',
            borderRadius: 24,
            padding: '10px 24px',
            fontFamily: "'Cairo', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: `0 4px 16px ${bannerColor}66`,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            direction: 'rtl',
          }}
        >
          {bannerMessage}
        </div>

        {/* ── Legend ── */}
        <div
          className="maps-legend"
          style={{
            position: 'absolute',
            bottom: 24,
            left: 20,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.97)',
            borderRadius: 12,
            padding: '14px 18px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minWidth: 220,
            direction: 'rtl',
          }}
        >
          {LEGEND_ITEMS.map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: layers[item.key] ? item.color : '#bbb',
                    transition: 'background 0.25s',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#1a2d4a',
                  }}
                >
                  {item.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} color="#aaa" />
                <ToggleSwitch
                  checked={layers[item.key]}
                  onChange={() => toggleLayer(item.key)}
                  color={item.color}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Right info panel ── */}
        {anyLayerActive && (
          <div
            className="maps-right-panel"
            style={{
              position: 'absolute',
              bottom: 24,
              right: 20,
              zIndex: 1000,
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 16,
              padding: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              minWidth: 200,
              maxWidth: 240,
              direction: 'rtl',
            }}
          >
            {layers.safeRoutes && <InfoButton label="طرق أمنة" color="#4CAF50" icon="line" />}
            {layers.dangerZones && (
              <>
                <InfoButton label="طرق خطرة" color="#F44336" icon="line" />
                <InfoButton label="طرق بديلة عن الطرق الخطرة" color="#FF9800" icon="line" />
              </>
            )}
            {layers.resourceActivity && (
              <InfoButton label="نقاط توزيع مساعدات" color="#C8960C" icon="marker" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
