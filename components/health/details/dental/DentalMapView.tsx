'use client'

import FacilityEmbedMapView from '../FacilityEmbedMapView'
import type { HealthFacility } from '@/schemas/healthFacility'

export default function DentalMapView({
  clinic,
  onBack,
}: {
  clinic: HealthFacility
  onBack: () => void
}) {
  return <FacilityEmbedMapView facility={clinic} onBack={onBack} />
}
