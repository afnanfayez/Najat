'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import Image from 'next/image'

interface AdminMobileHeaderProps {
  onMenuOpen: () => void
  className?: string
  style?: React.CSSProperties
}

export default function AdminMobileHeader({
  onMenuOpen,
  className = '',
  style,
}: AdminMobileHeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #e8eef5',
        marginBottom: '20px',
        width: '100%',
        backgroundColor: 'transparent',
        ...style,
      }}
    >
      <div
        style={{ color: '#2196F3', cursor: 'pointer' }}
        onClick={onMenuOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onMenuOpen()}
        aria-label="فتح القائمة"
      >
        <Menu size={32} />
      </div>
      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
        <Image
          src="/assets/Logo2.png"
          alt="شعار نجاة"
          fill
          sizes="40px"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
  )
}
