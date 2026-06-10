'use client'

import dynamic from 'next/dynamic'
import type { FacilityLocationMapInnerProps } from './FacilityLocationMapInner'

const FacilityLocationMapInner = dynamic<FacilityLocationMapInnerProps>(
  () => import('./FacilityLocationMapInner'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e8f4fd',
          fontFamily: "'Cairo', sans-serif",
          fontSize: 16,
          color: '#2196F3',
          fontWeight: 700,
        }}
      >
        جاري تحميل الخريطة...
      </div>
    ),
  },
)

export default function FacilityLocationMap(props: FacilityLocationMapInnerProps) {
  return <FacilityLocationMapInner {...props} />
}
