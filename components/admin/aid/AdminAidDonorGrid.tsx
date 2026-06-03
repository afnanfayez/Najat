'use client'

import type { AdminAidDonor } from '@/schemas/adminAid'
import { ADMIN_AID_FONT } from './adminAidStyles'
import AdminAidDonorCard from './AdminAidDonorCard'

interface AdminAidDonorGridProps {
  donors: AdminAidDonor[]
  onDetails?: (donor: AdminAidDonor) => void
}

export default function AdminAidDonorGrid({ donors, onDetails }: AdminAidDonorGridProps) {
  return (
    <section className="mb-6">
      <h2
        className="mb-4 text-right text-base font-bold text-[#1E293B] sm:text-lg"
        style={{ fontFamily: ADMIN_AID_FONT }}
      >
        قائمة الجهات المانحة
      </h2>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
        {donors.map((donor, index) => (
          <AdminAidDonorCard
            key={`${donor.id}-${index}`}
            donor={donor}
            onDetails={onDetails}
          />
        ))}
      </div>
    </section>
  )
}
