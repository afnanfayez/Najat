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
    <div className="facility-card">
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
      
      <div className="facility-card-overlay" />

      <div className="facility-status-badge">
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

      <div className="facility-info-area">
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

        {facility.medicineAvailability !== undefined && (
          <div className="medicine-availability-bar">
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
                      ? '#F44336'
                      : facility.medicineAvailability < 70
                      ? '#FF9800'
                      : '#FFC107',
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

        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '8px',
            marginTop: '4px',
            direction: 'rtl',
          }}
        >
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
