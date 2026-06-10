'use client'

import SearchBar from './SearchBar'

interface DashboardHeaderProps {
  isMobile: boolean
  searchValue: string
  setSearchValue: (value: string) => void
  isSearchFocused: boolean
  setIsSearchFocused: (focused: boolean) => void
}

export default function DashboardHeader({
  isMobile,
  searchValue,
  setSearchValue,
  isSearchFocused,
  setIsSearchFocused,
}: DashboardHeaderProps) {
  return (
    <header
      style={{
        background: '#fff',
        padding: isMobile ? '0 20px 24px' : '12px 28px 10px',
        borderBottom: isMobile ? 'none' : '1px solid #e8eef5',
        boxShadow: isMobile ? 'none' : '0 2px 8px rgba(33,150,243,0.06)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'center',
          marginBottom: '8px',
          minHeight: isMobile ? 'auto' : '50px',
        }}
      >
        <h1
          className="header-title"
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: isMobile ? '32px' : '42px',
            fontWeight: 800,
            color: '#1a2d4a',
            margin: 0,
            textAlign: 'right',
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
          fontSize: isMobile ? '16px' : '19px',
          fontWeight: 600,
          margin: '0 0 24px',
          textAlign: 'right',
          lineHeight: '1.5',
          maxWidth: isMobile ? '100%' : '80%',
          marginRight: '0',
          marginLeft: 'auto',
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
