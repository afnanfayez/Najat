'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import AidCard from './AidCard'
import AidDetailView from './AidDetailView'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'food', label: 'غذاء' },
  { id: 'water', label: 'مياه' },
  { id: 'health', label: 'صحة' },
  { id: 'shelter', label: 'مأوى' },
  { id: 'clothes', label: 'ملابس وأغطية' },
]

const MOCK_AID: HumanitarianAid[] = [
  {
    id: '1',
    name: 'الاونروا (UNRWA)',
    provider: 'وكالة الأمم المتحدة لإغاثة وتشغيل اللاجئين',
    description: 'تقدم خدمات الطوارئ، الرعاية الصحية الأولية، وتوزيع المواد الغذائية الأساسية في كافة مناطق القطاع',
    status: 'active',
    tags: ['غذاء', 'تعليم', 'صحة'],
    category: 'all',
  },
  {
    id: '2',
    name: 'اطباء بلا حدود',
    provider: 'Medecins Sans Frontieres',
    description: 'تعمل في المستشفيات الرئيسية وتقدم الرعاية الجراحية الطارئة، النشاط يتركز حاليا في مناطق الجنوب',
    status: 'limited',
    tags: ['جراحة', 'ادوية'],
    category: 'health',
  },
  {
    id: '3',
    name: 'برنامج الأغذية العالمية',
    provider: 'World Food Programme',
    description: 'توزيع الطرود الغذائية الطارئة والقسائم الشرائية للأسر المتضررة والنازحين',
    status: 'active',
    tags: ['طعام', 'دعم مادي'],
    category: 'food',
  },
  {
    id: '4',
    name: 'مؤسسة واش (WASH)',
    provider: 'مبادرة المياه والصرف الصحي العالمي',
    description: 'تعليق مؤقت للعمليات الميدانية بسبب نقص الوقود وتضرر البنية التحتية الرئيسية للمياه',
    status: 'stopped',
    tags: ['مياه', 'تعقيم'],
    category: 'water',
  },
  {
    id: '5',
    name: 'المجلس النرويجي للاجئين',
    provider: 'Norwegian Refugee Council',
    description: 'توفير مواد الايواء الطارئة والبطانيات والمستلزمات المنزلية الاساسية للنازحين',
    status: 'active',
    tags: ['خيم', 'اغطية', 'ملابس'],
    category: 'shelter',
  },
  {
    id: '6',
    name: 'اليونيسيف (UNICEF)',
    provider: 'منظمة الأمم المتحدة للطفولة',
    description: 'حماية الطفل والدعم النفسي وتوفير اللقاحات والمياه الصالحة للشرب للاطفال والاسر',
    status: 'limited',
    tags: ['تعليم', 'مياه', 'طرود'],
    category: 'health',
  },
]

interface HumanitarianAidPageProps {
  setIsMobileMenuOpen?: (open: boolean) => void
}

export default function HumanitarianAidPage({ setIsMobileMenuOpen }: HumanitarianAidPageProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isMobile, setIsMobile] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedAid, setSelectedAid] = useState<HumanitarianAid | null>(null)

  const REGIONS = [
    'محافظة الشمال',
    'محافظة غزة',
    'المحافظة الوسطى',
    'محافظات الجنوب',
  ]

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filteredAid = MOCK_AID.filter(aid => {
    const matchesCategory = activeCategory === 'all' || aid.category === activeCategory
    const matchesSearch = aid.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         aid.description.toLowerCase().includes(searchValue.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (selectedAid) {
    return <AidDetailView aid={selectedAid} onBack={() => setSelectedAid(null)} />
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

      {/* Mobile Navbar */}
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

      {/* Header */}
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

      {/* Filter Container */}
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
        {/* Category tabs matching HealthServicesPage exactly */}
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

        {/* Search + Filter */}
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
                {selectedRegion || 'فلترة'}
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

      {/* Cards Grid */}
      <div
        className="aid-grid custom-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '32px',
          paddingRight: '4px',
        }}
      >
        {filteredAid.map((aid) => (
          <AidCard key={aid.id} aid={aid} onClick={() => setSelectedAid(aid)} />
        ))}
      </div>
    </div>
  )
}
