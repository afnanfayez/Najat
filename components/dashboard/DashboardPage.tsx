'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { removeToken } from '@/lib/api/auth'
import { useLoginStore } from '@/store/useLoginStore'
import { useRegisterStore } from '@/store/useRegisterStore'
import { useState, useEffect } from 'react'
import {
  LayoutGrid,
  Shield,
  Heart,
  Compass,
  FilePlus,
  User,
  Search,
  LogOut,
  Siren,
  Send,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { id: 'home',       label: 'الرئيسية',           icon: LayoutGrid,   active: true  },
  { id: 'health',     label: 'الخدمات الصحية',      icon: Shield,       active: false },
  { id: 'humanaid',   label: 'المساعدات الإنسانية', icon: Heart,        active: false },
  { id: 'maps',       label: 'الخرائط والملاحة',    icon: Compass,      active: false },
  { id: 'guide',      label: 'الدليل الصحي',        icon: FilePlus,     active: false },
  { id: 'emergency',  label: 'الطوارئ',             icon: Siren,        active: false, sos: true },
  { id: 'profile',    label: 'الملف الشخصي',        icon: User,         active: false },
]

const serviceCards = [
  {
    id: 'health-services',
    title: 'الخدمات الصحية',
    description: 'الوصول الفوري إلى الأطباء المتطوعين، طلب استشارة طبية، والبحث عن أقرب الصيدليات المتاحة.',
    icon: Shield,
    color: '#e3f4ff',
    iconColor: '#2196f3',
  },
  {
    id: 'humanitarian-aid',
    title: 'المساعدات الإنسانية',
    description: 'طلب طرود غذائية مستلزمات المعيشة الأساسية، أو العثور على مراكز توزيع المعونات القريبة منك.',
    icon: Heart,
    color: '#fff3e0',
    iconColor: '#f2a122',
  },
  {
    id: 'interactive-maps',
    title: 'الخرائط التفاعلية',
    description: 'تحديد المناطق الآمنة، ممرات الإجلاء ومراكز الإيواء المحدثة لحظياً حسب الوضع الراهن.',
    icon: Compass,
    color: '#f3e8ff',
    iconColor: '#9c27b0',
  },
  {
    id: 'health-guide',
    title: 'الدليل الصحي',
    description: 'إرشادات الإسعافات الأولية، كيفية التعامل مع الإصابات الشائعة في الأزمات، ونصائح الصحة النفسية.',
    icon: FilePlus,
    color: '#e8f5e9',
    iconColor: '#4caf50',
  },
  {
    id: 'emergency-cases',
    title: 'حالات الطوارئ',
    description: 'اتصال الفوري بفرق الإنقاذ والدفاع المدني، اطلب النجدة الفورية في حالات الخطر الشديد.',
    icon: Siren,
    color: '#fff0f0',
    iconColor: '#f44336',
    sos: true,
  },
  {
    id: 'conversations',
    title: 'المحادثات',
    description: 'التواصل المباشر مع غرفة العمليات، المتطوعين، المتطوعين، مجموعات الدعم المجتمعي في منطقتك.',
    icon: Send,
    color: '#e3f4ff',
    iconColor: '#2196f3',
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { resetLogin } = useLoginStore()
  const { resetRegister } = useRegisterStore()
  const [activeNav, setActiveNav] = useState('home')
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [hoveredServiceCard, setHoveredServiceCard] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const searchSuggestions = [
    { id: 'emergency-nums', label: 'ارقام الطوارئ' },
    { id: 'hospitals',      label: 'المستشفيات' },
    { id: 'aid',            label: 'المساعدات' },
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = () => {
    removeToken()
    resetLogin()
    resetRegister()
    router.push('/login')
  }

  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        fontFamily: "'Cairo', 'Geist', 'Segoe UI', sans-serif",
        background: '#f4f7fb',
        direction: 'rtl',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; width: 100%; max-width: 100%; }
        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .main-container { width: 100% !important; padding-right: 0 !important; }
          .services-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            padding: 10px !important;
            padding-bottom: 60px !important;
          }
          .content-body { padding: 15px !important; overflow-y: auto !important; }
        }
        @media (max-width: 768px) {
          .services-grid { 
            grid-template-columns: 1fr !important; 
            gap: 12px !important; 
            padding-bottom: 20px !important; 
          }
          .header-title { font-size: 20px !important; }
          .header-desc { font-size: 13px !important; margin-bottom: 12px !important; }
          .search-container { 
            gap: 6px; 
            padding: 2px 10px !important;
            margin-bottom: 8px !important;
            overflow: hidden;
          }
          .search-input { font-size: 13px !important; flex: 1; min-width: 0; }
          .search-btn { 
            padding: 4px 10px !important; 
            font-size: 12px !important;
            flex-shrink: 0;
          }
          .emergency-banner { height: 50px !important; margin-bottom: 16px !important; }
          .emergency-title { font-size: 1.2rem !important; }
          .section-header { text-align: right !important; margin-bottom: 12px !important; }
        }
        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: ${isMobileMenuOpen ? '0' : '-320px'};
          width: 320px;
          height: 100vh;
          background: #2196F3;
          z-index: 1100;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
          overflow-y: auto;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 45, 74, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1050;
          opacity: ${isMobileMenuOpen ? '1' : '0'};
          pointer-events: ${isMobileMenuOpen ? 'auto' : 'none'};
          transition: opacity 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d0dcea;
          border-radius: 10px;
        }
      ` }} />

      <div className="overlay" onClick={() => setIsMobileMenuOpen(false)} />

      <div className="mobile-sidebar">
        <div style={{ padding: '25px 25px 10px', display: 'flex', justifyContent: 'flex-start' }}>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%' }}
          >
            <X size={24} />
          </Button>
        </div>
        <SidebarContent 
          activeNav={activeNav} 
          setActiveNav={setActiveNav} 
          hoveredNav={hoveredNav} 
          setHoveredNav={setHoveredNav} 
          handleLogout={handleLogout} 
        />
      </div>

      <aside
        className="desktop-sidebar"
        style={{
          width: '320px',
          minWidth: '320px',
          height: '100vh',
          background: '#2196F3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px 0 20px',
          position: 'relative',
          top: '-0.58px',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        <SidebarContent 
          activeNav={activeNav} 
          setActiveNav={setActiveNav} 
          hoveredNav={hoveredNav} 
          setHoveredNav={setHoveredNav} 
          handleLogout={handleLogout} 
        />
      </aside>

      {/* ===== Main Content ===== */}
      <main 
        className="main-container"
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minWidth: 0, 
          overflow: 'hidden', 
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        <header
          style={{
            background: '#fff',
            padding: '12px 28px 10px',
            borderBottom: '1px solid #e8eef5',
            boxShadow: '0 2px 8px rgba(33,150,243,0.06)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', minHeight: '50px' }}>
            {isMobile && (
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ 
                  color: '#2196F3', 
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                }}
              >
                <Menu size={32} />
              </Button>
            )}
            <h1
              className="header-title"
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: '42px',
                fontWeight: 800,
                color: '#1a2d4a',
                margin: 0,
                textAlign: isMobile ? 'center' : 'right',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                flex: 1,
              }}
            >
              كيف يمكننا مساعدتك اليوم؟
            </h1>
          </div>
          <p
            style={{
              fontFamily: "'Cairo', sans-serif",
              color: '#4a5568',
              fontSize: '19px',
              fontWeight: 600,
              margin: '0 0 24px',
              textAlign: isMobile ? 'center' : 'right',
              lineHeight: '1.5',
              maxWidth: isMobile ? '100%' : '80%',
              marginRight: isMobile ? 'auto' : '0',
              marginLeft: isMobile ? 'auto' : '0',
            }}
          >
            نحن هنا لضمان سلامتك. ابحث عن الخدمات الأساسية أو اطلب المساعدة الفورية في أي وقت.
          </p>

          <div style={{ position: 'relative', width: '100%', marginRight: 'auto' }}>
            <div
              className="search-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f0f5fb',
                borderRadius: '12px',
                border: isSearchFocused ? '1.5px solid #2196F3' : '1.5px solid #d0dcea',
                padding: '4px 16px',
                gap: '12px',
                width: '100%',
                transition: 'border-color 0.2s ease',
              }}
            >
              <Search size={20} color="#2196F3" style={{ flexShrink: 0 }} />
              <Input
                id="dashboard-search"
                className="search-input"
                type="text"
                placeholder="ابحث عن الخدمات، المستشفيات، أو مراكز الإيواء..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  color: '#1a2d4a',
                  padding: '10px 0',
                  textAlign: 'right',
                  direction: 'rtl',
                }}
              />
              <Button
                id="search-btn"
                className="search-btn"
                style={{
                  background: 'linear-gradient(135deg, #2196f3, #1565c0)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                بحث
              </Button>
            </div>

            {isSearchFocused && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  left: 0,
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #e8eef5',
                  zIndex: 2000,
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s ease-out',
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                ` }} />
                {searchSuggestions.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSearchValue(item.label)
                      setIsSearchFocused(false)
                    }}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '12px',
                      cursor: 'pointer',
                      borderBottom: index === searchSuggestions.length - 1 ? 'none' : '1px solid #f0f5fb',
                      transition: 'background 0.2s ease',
                      fontFamily: "'Cairo', sans-serif",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fbff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    <Search size={18} color="#a0aec0" style={{ flexShrink: 0 }} />
                    <span style={{ color: '#4a5568', fontSize: '15px', fontWeight: 500, flex: 1 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <div 
          className="content-body custom-scrollbar"
          style={{ flex: 1, padding: '15px 35px', overflowY: isMobile ? 'auto' : 'hidden', overflowX: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}
        >
          <div
            className="emergency-banner"
            style={{
              background: 'linear-gradient(135deg, #F44336, #D32F2F)',
              borderRadius: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(244,67,54,0.3)',
              cursor: 'pointer',
              height: '120px',
              width: '100%',
              flexShrink: 0,
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div
              style={{
                position: 'absolute',
                width: isMobile ? '280px' : '420px',
                height: isMobile ? '280px' : '420px',
                borderRadius: '50%',
                background: '#FFFFFF4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 0,
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: isMobile ? '200px' : '320px',
                  height: isMobile ? '200px' : '320px',
                  borderRadius: '50%',
                  background: '#FFFFFF99',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: isMobile ? '120px' : '200px',
                    height: isMobile ? '120px' : '200px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <h2
                    className="emergency-title"
                    style={{
                      color: '#F44336',
                      fontSize: isMobile ? '1.5rem' : '3.2rem',
                      fontWeight: 900,
                      margin: 0,
                      zIndex: 2,
                      fontFamily: "'Cairo', sans-serif",
                      transition: 'all 0.3s ease',
                    }}
                  >
                    الطوارئ
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="section-header" style={{ marginBottom: '24px', textAlign: 'right', flexShrink: 0 }}>
            <h3
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: '24px',
                fontWeight: 700,
                color: '#1a2d4a',
                margin: '0 0 8px',
                lineHeight: '1.2',
              }}
            >
              الخدمات الرئيسية
            </h3>
            <p style={{ 
              fontFamily: "'Cairo', sans-serif",
              color: '#4a5568', 
              fontSize: '16px', 
              fontWeight: 500, 
              margin: 0,
              lineHeight: '1.5',
            }}>
              اختر الخدمة التي تحتاج إليها للبدء
            </p>
          </div>

          <div
            className="services-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              flex: 1,
              minHeight: 0,
              paddingBottom: '100px',
            }}
          >
            {serviceCards.map((card) => {
              const Icon = card.icon
              return (
                <Card
                  key={card.id}
                  id={`card-${card.id}`}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px 20px',
                    minHeight: '180px',
                    boxShadow: '0 4px 12px rgba(33,150,243,0.06)',
                    border: '1px solid #e8eef5',
                    cursor: 'pointer',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    justifyContent: 'center',
                    minWidth: 0,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(-4px)'
                    el.style.boxShadow = '0 8px 24px rgba(33,150,243,0.12)'
                    setHoveredServiceCard(card.id)
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 4px 12px rgba(33,150,243,0.06)'
                    setHoveredServiceCard(null)
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: hoveredServiceCard === card.id ? '#2196F3' : '#2196F333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'flex-start',
                      marginBottom: '2px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {card.sos ? (
                      <span
                        style={{
                          color: hoveredServiceCard === card.id ? '#fff' : '#2196F3',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          fontFamily: "'Cairo', sans-serif",
                        }}
                      >
                        SOS
                      </span>
                    ) : (
                      <Icon size={16} color={hoveredServiceCard === card.id ? '#fff' : '#2196F3'} strokeWidth={1.5} />
                    )}
                  </div>

                  <h4
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      fontWeight: 700,
                      fontSize: '16px',
                      color: '#000',
                      margin: 0,
                      lineHeight: '1.2',
                    }}
                  >
                    {card.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      fontWeight: 500,
                      fontSize: '15px',
                      color: '#000000ff',
                      margin: 0,
                      lineHeight: '1.4',
                    }}
                  >
                    {card.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

function SidebarContent({ activeNav, setActiveNav, hoveredNav, setHoveredNav, handleLogout }: any) {
  return (
    <>
      {/* Logo */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
        <Image
          src="/assets/Logo2.png"
          alt="شعار نجاة"
          width={100}
          height={100}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Nav Links */}
      <nav style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id
          const isHovered = hoveredNav === item.id
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveNav(item.id)}
              onMouseEnter={() => setHoveredNav(item.id)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                width: '260px',
                height: '51px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '12px',
                paddingTop: '2px',
                paddingRight: '12px',
                paddingBottom: '2px',
                paddingLeft: '8px',
                background: isActive ? '#FFFFFF80' : isHovered ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: "'Cairo', sans-serif",
                fontSize: '20px',
                fontWeight: isActive ? '600' : '500',
                lineHeight: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                textAlign: 'right',
                opacity: isActive || isHovered ? 1 : 0.85,
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px' }}>
                {item.sos ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 12H9C9.55228 12 10 11.5523 10 11C10 10.4477 9.55228 10 9 10H8C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12H9C9.55228 12 10 12.4477 10 13C10 13.5523 9.55228 14 9 14H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 10C11.4477 10 11 10.4477 11 11V13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V11C13 10.4477 12.5523 10 12 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H17C17.5523 12 18 11.5523 18 11C18 10.4477 17.5523 10 17 10H16C15.4477 10 15 10.4477 15 11C15 11.5523 15.4477 12 16 12H17C17.5523 12 18 12.4477 18 13C18 13.5523 17.5523 14 17 14H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <Icon size={24} strokeWidth={2} />
                )}
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ paddingBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button
          id="logout-btn"
          onClick={handleLogout}
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(244,67,54,0.15)',
            border: '1px solid rgba(244,67,54,0.35)',
            borderRadius: '10px',
            color: '#ff8a80',
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'background 0.2s',
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,67,54,0.28)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,67,54,0.15)')
          }
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </>
  )
}
