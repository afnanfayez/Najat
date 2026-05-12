'use client'

import FacilityEmbedMapView from '../FacilityEmbedMapView'
import type { HealthFacility } from '@/schemas/healthFacility'

export default function PharmacyMapView({
  pharmacy,
  onBack,
}: {
  pharmacy: HealthFacility
  onBack: () => void
}) {
  return <FacilityEmbedMapView facility={pharmacy} onBack={onBack} />
}
