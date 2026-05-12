'use client'

import FacilityEmbedMapView from '../FacilityEmbedMapView'
import type { HealthFacility } from '@/schemas/healthFacility'

export default function LabMapView({
  lab,
  onBack,
}: {
  lab: HealthFacility
  onBack: () => void
}) {
  return <FacilityEmbedMapView facility={lab} onBack={onBack} />
}
