'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { removeToken } from '@/lib/api/auth'
import { useLoginStore } from '@/store/useLoginStore'
import { useRegisterStore } from '@/store/useRegisterStore'
import HealthServicesPage from '@/components/health/HealthServicesPage'
import HumanitarianAidPage from '@/components/aid/HumanitarianAidPage'
import DashboardSidebar from './sidebar/DashboardSidebar'
import DashboardHeader from './header/DashboardHeader'
import HomeSection from './sections/HomeSection'

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
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

  const handleCardClick = (cardId: string) => {
    if (cardId === 'health-services') {
      setActiveNav('health')
      setIsMobileMenuOpen(false)
    } else if (cardId === 'humanitarian-aid') {
      setActiveNav('humanaid')
      setIsMobileMenuOpen(false)
    }
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
      {/* Global layout + responsive styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; overflow: hidden; width: 100%; max-width: 100%; }

            @media (max-width: 1024px) {
              .desktop-sidebar { display: none !important; }
              .main-container  { width: 100% !important; padding-right: 0 !important; }
              .services-grid   { grid-template-columns: repeat(2, 1fr) !important; padding: 10px !important; padding-bottom: 60px !important; }
              .content-body    { padding: 15px !important; overflow-y: auto !important; }
            }

            @media (max-width: 768px) {
              .services-grid    { grid-template-columns: 1fr !important; gap: 12px !important; padding-bottom: 20px !important; }
              .header-title     { font-size: 20px !important; }
              .header-desc      { font-size: 13px !important; margin-bottom: 12px !important; }
              .search-container { gap: 6px; padding: 2px 10px !important; margin-bottom: 8px !important; overflow: hidden; }
              .search-input     { font-size: 13px !important; flex: 1; min-width: 0; }
              .search-btn       { padding: 4px 10px !important; font-size: 12px !important; flex-shrink: 0; }
              .emergency-banner { height: 50px !important; margin-bottom: 16px !important; }
              .emergency-title  { font-size: 1.2rem !important; }
              .section-header   { text-align: right !important; margin-bottom: 12px !important; }
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
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(26, 45, 74, 0.6);
              backdrop-filter: blur(4px);
              z-index: 1050;
              opacity: ${isMobileMenuOpen ? '1' : '0'};
              pointer-events: ${isMobileMenuOpen ? 'auto' : 'none'};
              transition: opacity 0.3s ease;
            }

            .custom-scrollbar::-webkit-scrollbar       { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #d0dcea; border-radius: 10px; }
          `,
        }}
      />

      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        hoveredNav={hoveredNav}
        setHoveredNav={setHoveredNav}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main
        className="main-container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {activeNav === 'health' ? (
          /* Health services — full height, no dashboard header */
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              padding: '24px 32px',
              overflowY: 'hidden',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              background: '#fff',
            }}
          >
            <HealthServicesPage setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </div>
        ) : activeNav === 'humanaid' ? (
          /* Humanitarian aid — full height, no dashboard header */
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              padding: '24px 32px',
              overflowY: 'hidden',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              background: '#fff',
            }}
          >
            <HumanitarianAidPage setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </div>
        ) : (
          /* All other sections — show dashboard header + content */
          <>
            <DashboardHeader
              isMobile={isMobile}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
            />
            <div
              className="content-body custom-scrollbar"
              style={{
                flex: 1,
                padding: '15px 35px',
                overflowY: isMobile ? 'auto' : 'hidden',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
              }}
            >
              <HomeSection
                isMobile={isMobile}
                hoveredServiceCard={hoveredServiceCard}
                setHoveredServiceCard={setHoveredServiceCard}
                onCardClick={handleCardClick}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
