'use client'

import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import { AID_STATUS_LABELS, AID_STATUS_COLORS } from '@/schemas/humanitarianAid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AidCardProps {
  aid: HumanitarianAid
  onClick?: () => void
}

export default function AidCard({ aid, onClick }: AidCardProps) {
  const statusColor = AID_STATUS_COLORS[aid.status]
  
  return (
    <Card
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        border: '1px solid #eef2f6',
        position: 'relative',
        direction: 'rtl',
        transition: 'transform 0.2s ease',
        height: '260px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <CardHeader style={{ padding: '20px 20px 0', marginTop: '4px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: '12px'
        }}>
          <CardTitle
            style={{
              margin: 0,
              fontFamily: "'Cairo', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#2196F3',
              textAlign: 'right',
              lineHeight: '1.2',
              flex: 1,
            }}
          >
            {aid.name}
          </CardTitle>

          {/* Status Badge */}
          <Badge
            variant="secondary"
            style={{
              background: `${statusColor}15`,
              color: statusColor,
              fontFamily: "'Cairo', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '20px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: statusColor,
              }}
            />
            {AID_STATUS_LABELS[aid.status]}
          </Badge>
        </div>
        
        <p
          style={{
            margin: '4px 0 0',
            fontFamily: "'Cairo', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: '#9e9e9e',
            textAlign: 'right',
          }}
        >
          {aid.provider}
        </p>
      </CardHeader>

      <CardContent style={{ padding: '12px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'Cairo', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: '#1a2d4a',
            lineHeight: '1.7',
            textAlign: 'right',
            marginBottom: '12px',
          }}
        >
          {aid.description}
        </p>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: 'auto',
            justifyContent: 'flex-start',
          }}
        >
          {aid.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              style={{
                background: '#7E7D7D2E',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '8px',
                fontFamily: "'Cairo', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                color: '#475569',
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
