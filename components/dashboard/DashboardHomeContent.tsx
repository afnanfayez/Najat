'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from './header/DashboardHeader'
import HomeSection from './sections/HomeSection'
import { useDashboardShell } from './DashboardShellContext'

export default function DashboardHomeContent() {
  const router = useRouter()
  const shell = useDashboardShell()

  const [hoveredServiceCard, setHoveredServiceCard] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCardClick = (cardId: string) => {
    if (cardId === 'health-services') {
      router.push('/hospitals')
      shell?.setIsMobileMenuOpen(false)
    } else if (cardId === 'humanitarian-aid') {
      router.push('/humanitarian-aid')
      shell?.setIsMobileMenuOpen(false)
    } else if (cardId === 'health-guide') {
      router.push('/health-guide')
      shell?.setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <DashboardHeader
        isMobile={isMobile}
        setIsMobileMenuOpen={shell?.setIsMobileMenuOpen ?? (() => {})}
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
          minHeight: 0,
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
  )
}
