'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { searchSuggestions } from '../data/dashboardConstants'

interface SearchBarProps {
  searchValue: string
  setSearchValue: (value: string) => void
  isSearchFocused: boolean
  setIsSearchFocused: (focused: boolean) => void
}

export default function SearchBar({
  searchValue,
  setSearchValue,
  isSearchFocused,
  setIsSearchFocused,
}: SearchBarProps) {
  return (
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
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-10px); }
                  to   { opacity: 1; transform: translateY(0);     }
                }
              `,
            }}
          />
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
                borderBottom:
                  index === searchSuggestions.length - 1
                    ? 'none'
                    : '1px solid #f0f5fb',
                transition: 'background 0.2s ease',
                fontFamily: "'Cairo', sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#f8fbff')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = '#fff')
              }
            >
              <Search size={18} color="#a0aec0" style={{ flexShrink: 0 }} />
              <span
                style={{
                  color: '#4a5568',
                  fontSize: '15px',
                  fontWeight: 500,
                  flex: 1,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
