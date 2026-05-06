'use client'

import { Card } from '@/components/ui/card'
import type { ServiceCardData } from '../data/dashboardConstants'

interface ServiceCardProps {
  card: ServiceCardData
  hoveredServiceCard: string | null
  setHoveredServiceCard: (id: string | null) => void
  onCardClick?: (cardId: string) => void
}

export default function ServiceCard({
  card,
  hoveredServiceCard,
  setHoveredServiceCard,
  onCardClick,
}: ServiceCardProps) {
  const Icon = card.icon
  const isHovered = hoveredServiceCard === card.id

  return (
    <Card
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
      onClick={() => onCardClick(card.id)}
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
          background: isHovered ? '#2196F3' : '#2196F333',
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
              color: isHovered ? '#fff' : '#2196F3',
              fontWeight: 700,
              fontSize: '0.7rem',
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            SOS
          </span>
        ) : (
          <Icon
            size={16}
            color={isHovered ? '#fff' : '#2196F3'}
            strokeWidth={1.5}
          />
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
}
