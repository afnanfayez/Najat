'use client'

import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'
import type { HealthFacility } from '@/schemas/healthFacility'

type Props = {
  facility: HealthFacility
  onNavigate?: (facility: HealthFacility) => void
  onCall?: (facility: HealthFacility) => void
}

export default function FacilityCard({ facility, onNavigate, onCall }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: '380px',
        direction: 'rtl',
      }}
    >
      {/* ── Background Image & Gradient ── */}
      {facility.imageUrl ? (
        <Image
          src={facility.imageUrl}
          alt={facility.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#D9D9D9', zIndex: 0 }} />
      )}
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Status badge — top-left ── */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: '#fff',
          borderRadius: '20px',
          padding: '4px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: facility.isOpen ? '#4CAF50' : '#9E9E9E',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            color: facility.isOpen ? '#4CAF50' : '#9E9E9E',
          }}
        >
          {facility.isOpen ? 'مفتوح الان' : 'مغلق'}
        </span>
      </div>

      {/* ── Info area ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Name + address */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: '22px',
              color: '#fff',
              textAlign: 'right',
            }}
          >
            {facility.name}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#E0E0E0',
            }}
          >
            <MapPin size={14} color="#E0E0E0" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 500,
                fontSize: '13px',
              }}
            >
              {facility.address}
            </span>
          </div>
        </div>

        {/* Medicine availability bar */}
        {facility.medicineAvailability !== undefined && (
          <div
            style={{
              background: 'rgba(150,150,150,0.7)',
              borderRadius: '6px',
              padding: '10px 12px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#fff',
                }}
              >
                نسبة عمل المستشفى
              </span>
              <span
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#fff',
                }}
              >
                {facility.medicineAvailability}%
              </span>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '4px',
                height: '8px',
                width: '100%',
                position: 'relative',
              }}
            >
              <div
                style={{
                  background:
                    facility.medicineAvailability < 30
                      ? '#F44336' // Red
                      : facility.medicineAvailability < 70
                      ? '#FF9800' // Orange
                      : '#FFC107', // Yellow
                  borderRadius: '4px',
                  height: '100%',
                  width: `${facility.medicineAvailability}%`,
                  transition: 'width 0.4s ease',
                  position: 'absolute',
                  right: 0,
                }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '8px',
            marginTop: '4px',
            direction: 'rtl',
          }}
        >
          {/* Details button (Wide Blue) */}
          <button
            onClick={() => onNavigate?.(facility)}
            style={{
              flex: 1,
              height: '42px',
              background: '#2196F3',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#1976D2')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#2196F3')
            }
          >
            التفاصيل
          </button>
          
          {/* Phone button (Green) */}
          <button
            onClick={() => onCall?.(facility)}
            style={{
              width: '60px',
              height: '42px',
              background: '#4CAF50',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#388E3C')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#4CAF50')
            }
          >
            <Phone size={18} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}
