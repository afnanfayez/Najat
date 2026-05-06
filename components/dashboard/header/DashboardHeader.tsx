'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchBar from './SearchBar'

interface DashboardHeaderProps {
  isMobile: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  searchValue: string
  setSearchValue: (value: string) => void
  isSearchFocused: boolean
  setIsSearchFocused: (focused: boolean) => void
}

export default function DashboardHeader({
  isMobile,
  setIsMobileMenuOpen,
  searchValue,
  setSearchValue,
  isSearchFocused,
  setIsSearchFocused,
}: DashboardHeaderProps) {
  return (
    <header
      style={{
        background: '#fff',
        padding: '12px 28px 10px',
        borderBottom: '1px solid #e8eef5',
        boxShadow: '0 2px 8px rgba(33,150,243,0.06)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
          minHeight: '50px',
        }}
      >
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

      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
      />
    </header>
  )
}
