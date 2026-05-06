'use client'

import EmergencyBanner from './EmergencyBanner'
import ServiceCard from './ServiceCard'
import { serviceCards } from '../data/dashboardConstants'

interface HomeSectionProps {
  isMobile: boolean
  hoveredServiceCard: string | null
  setHoveredServiceCard: (id: string | null) => void
  onCardClick?: (cardId: string) => void
}

export default function HomeSection({
  isMobile,
  hoveredServiceCard,
  setHoveredServiceCard,
  onCardClick,
}: HomeSectionProps) {
  return (
    <>
      <EmergencyBanner isMobile={isMobile} />

      <div
        className="section-header"
        style={{ marginBottom: '24px', textAlign: 'right', flexShrink: 0 }}
      >
        <h3
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a2d4a',
            margin: '0 0 8px',
            lineHeight: '1.2',
          }}
        >
          الخدمات الرئيسية
        </h3>
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            color: '#4a5568',
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
            lineHeight: '1.5',
          }}
        >
          اختر الخدمة التي تحتاج إليها للبدء
        </p>
      </div>

      <div
        className="services-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          flex: 1,
          minHeight: 0,
          paddingBottom: '100px',
        }}
      >
        {serviceCards.map((card) => (
          <ServiceCard
            key={card.id}
            card={card}
            hoveredServiceCard={hoveredServiceCard}
            setHoveredServiceCard={setHoveredServiceCard}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </>
  )
}
