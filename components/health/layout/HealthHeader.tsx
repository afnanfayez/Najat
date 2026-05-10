'use client'

import React from 'react'

interface HealthHeaderProps {
  onShowMap: () => void
}

export default function HealthHeader({ onShowMap }: HealthHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '24px',
        gap: '8px',
        flexShrink: 0,
      }}
    >
      <h2
        className="hsp-page-title"
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(22px, 3vw, 42px)',
          color: '#1a2d4a',
          margin: '0',
          lineHeight: '1.15',
          textAlign: 'right',
        }}
      >
        الخدمات الصحية
      </h2>

      <div 
        className="header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: '12px'
        }}
      >
        <p
          className="hsp-subtitle"
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 500,
            fontSize: '15px',
            color: '#000',
            margin: 0,
            textAlign: 'right',
            lineHeight: '1.6',
            flex: 1,
          }}
        >
          ابحث عن أقرب مراكز الرعاية الصحية وتأكد من توفر الأدوية في الوقت الفعلي
        </p>

        <button
          className="map-btn"
          onClick={onShowMap}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 32px',
            background: '#2196F3',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 600,
            fontSize: '15px',
            color: '#fff',
            flexShrink: 0,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = '#1976D2')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = '#2196F3')
          }
        >
          <img src="https://api.iconify.design/proicons:location.svg?color=white" alt="Map" className="w-5 h-5" />
          عرض الخريطة
        </button>
      </div>
    </div>
  )
}
