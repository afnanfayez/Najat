'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { toast } from 'sonner'
import AidCard from './AidCard'
import AidDetailView from './AidDetailView'
import { useAid } from '@/hooks/useAid'
import { useDashboardShell } from '@/components/dashboard/DashboardShellContext'
import {
  HUMANITARIAN_AID_LIST_PATH,
  humanitarianAidOrdinalPath,
  parseOrdinalRouteParam,
  resolveAidByOrdinal,
  sortAidByStableId,
} from '@/lib/health/healthFacilityRoutes'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'food', label: 'غذاء' },
  { id: 'water', label: 'مياه' },
  { id: 'health', label: 'صحة' },
  { id: 'shelter', label: 'مأوى' },
  { id: 'clothes', label: 'ملابس وأغطية' },
]

interface HumanitarianAidPageProps {
  setIsMobileMenuOpen?: (open: boolean) => void
  aidId?: string
}

export default function HumanitarianAidPage({
  setIsMobileMenuOpen,
  aidId,
}: HumanitarianAidPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeParams = useParams<{ id?: string }>()
  const urlSearch = searchParams ? (searchParams.get('search') || '') : ''

  // fallback لـ aidId من الـ URL عند الأوفلاين (حين لا تصل server props)
  const [urlAidId, setUrlAidId] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (aidId) return
    const paramId = routeParams?.id
    if (paramId && /^\d+$/.test(paramId)) {
      setUrlAidId(paramId)
      return
    }
    const segments = window.location.pathname.split('/').filter(Boolean)
    const last = segments[segments.length - 1]
    if (last && /^\d+$/.test(last)) {
      setUrlAidId(last)
    }
  }, [aidId, routeParams?.id])

  const effectiveAidId = aidId ?? urlAidId

  const shell = useDashboardShell()
  const openMobileMenu = setIsMobileMenuOpen ?? shell?.setIsMobileMenuOpen
  const [activeCategory, setActiveCategory] = useState('all')
  const [isMobile, setIsMobile] = useState(false)
  const [searchValue, setSearchValue] = useState(urlSearch)
  const [offlineDetailAid, setOfflineDetailAid] = useState<HumanitarianAid | null>(null)

  useEffect(() => {
    setSearchValue(urlSearch)
  }, [urlSearch])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const aidQueryParams = useMemo(
    () =>
      effectiveAidId
        ? { category: 'all' as const, search: '', region: undefined }
        : {
            category: activeCategory,
            search: searchValue,
            region: selectedRegion ?? undefined,
          },
    [effectiveAidId, activeCategory, searchValue, selectedRegion],
  )

  const REGIONS = [
    'الكل',
    'الشمال',
    'الجنوب',
  ]

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const {
    data: filteredAid = [],
    catalog: aidCatalog = [],
    isLoading: isAidLoading,
    isError: isAidError,
  } = useAid(aidQueryParams)

  const routeOrdinal = effectiveAidId ? parseOrdinalRouteParam(effectiveAidId) : null

  const resolvedDetailAid = useMemo(() => {
    if (routeOrdinal == null) return null
    return resolveAidByOrdinal(aidCatalog, routeOrdinal)
  }, [routeOrdinal, aidCatalog])

  if (offlineDetailAid) {
    return (
      <AidDetailView
        aid={offlineDetailAid}
        onBack={() => setOfflineDetailAid(null)}
      />
    )
  }

  if (effectiveAidId) {
    if (routeOrdinal === null) {
      return (
        <div dir="rtl" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontWeight: 700, marginBottom: 16 }}>
            رقم المساعدة في الرابط غير صالح (استخدم أرقام فقط: 1، 2، 3…)
          </p>
          <button
            type="button"
            onClick={() => router.push(HUMANITARIAN_AID_LIST_PATH)}
            className="text-blue-600 underline"
          >
            رجوع للقائمة
          </button>
        </div>
      )
    }
    if (isAidError) {
      return (
        <div dir="rtl" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#f44336', marginBottom: 16, fontWeight: 600 }}>
            حدث خطأ أثناء تحميل البيانات
          </p>
          <button
            type="button"
            onClick={() => router.push(HUMANITARIAN_AID_LIST_PATH)}
            className="text-blue-600 underline"
          >
            رجوع للقائمة
          </button>
        </div>
      )
    }
    if (isAidLoading && aidCatalog.length === 0) {
      return (
        <div
          dir="rtl"
          style={{ padding: 40, textAlign: 'center', color: '#9e9e9e' }}
        >
          جارٍ التحميل...
        </div>
      )
    }
    if (!resolvedDetailAid) {
      return (
        <div dir="rtl" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontWeight: 700, marginBottom: 16 }}>
            هذه المساعدة غير موجودة
          </p>
          <button
            type="button"
            onClick={() => router.push(HUMANITARIAN_AID_LIST_PATH)}
            className="text-blue-600 underline"
          >
            رجوع للقائمة
          </button>
        </div>
      )
    }
    return (
      <AidDetailView
        aid={resolvedDetailAid}
        onBack={() => router.push(HUMANITARIAN_AID_LIST_PATH)}
      />
    )
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
        background: '#fff',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .aid-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              grid-auto-rows: 1fr;
              gap: 24px;
            }
            @media (max-width: 1024px) {
              .aid-grid { grid-template-columns: 1fr; }
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />


      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: '28px',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? '32px' : '48px',
            color: '#1a2d4a',
            margin: '0',
            lineHeight: '1.1',
            textAlign: 'right',
            width: '100%',
          }}
        >
          المساعدات الإنسانية
        </h2>
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 600,
            fontSize: isMobile ? '16px' : '18px',
            color: '#000',
            margin: 0,
            textAlign: 'right',
            lineHeight: '1.6',
            width: '100%',
          }}
        >
          احصل على الدعم الضروري بسرعة وسهولة خلال الأزمات
        </p>
      </div>


      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '2px solid #e5e7eb',
          marginBottom: '32px',
          flexShrink: 0,
        }}
      >

        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderBottom: '1.5px solid rgba(126,125,125,0.18)',
            marginBottom: '16px',
            overflowX: 'auto',
            gap: '0',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
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
                {cat.label}
              </button>
            )
          })}
        </div>


        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '2px 18px',
              border: '1px solid #f1f5f9',
              minWidth: isMobile ? '100%' : 'auto',
            }}
          >
            <Search size={20} color="#2196F3" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="ابحث عن الخدمات، المستشفيات، أو مراكز الإيواء..."
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-right font-semibold"
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: '15px',
              }}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex items-center gap-2 px-12 py-6 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold text-base min-w-[180px] w-full lg:w-auto"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <Filter size={18} />
                {selectedRegion && selectedRegion !== 'الكل' ? selectedRegion : 'فلترة'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-[200px] lg:w-[220px] rounded-xl shadow-xl border-slate-200"
              style={{ direction: 'rtl' }}
            >
              {REGIONS.map((region) => (
                <DropdownMenuItem
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`text-right py-3 px-4 font-semibold cursor-pointer ${selectedRegion === region ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {region}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


      <div
        className="aid-grid custom-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '32px',
          paddingRight: '4px',
        }}
      >
        {isAidError ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '48px 0',
              color: '#f44336',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            حدث خطأ أثناء تحميل البيانات، يرجى المحاولة مجدداً
          </div>
        ) : isAidLoading ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '48px 0',
              color: '#9e9e9e',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            جارٍ التحميل...
          </div>
        ) : filteredAid.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '48px 0',
              color: '#9e9e9e',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            لا توجد مساعدات مطابقة للبحث
          </div>
        ) : (
          filteredAid.map((aid) => (
          <AidCard
              key={aid.id}
              aid={aid}
              onClick={() => {
                if (typeof navigator !== 'undefined' && !navigator.onLine) {
                  setOfflineDetailAid(aid)
                  toast.info('تم فتح تفاصيل المساعدة من البيانات المحفوظة')
                  return
                }
                const sorted = sortAidByStableId(aidCatalog)
                const idx = sorted.findIndex((a) => a.id === aid.id)
                if (idx < 0) return
                router.push(humanitarianAidOrdinalPath(idx + 1))
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
