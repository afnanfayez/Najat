'use client'

import { Check } from 'lucide-react'
import SetupSectionCard from './SetupSectionCard'
import { ADMIN_AID_TARGET_GROUPS } from '@/lib/mocks/adminAidMockData'
import type { AdminAidDistributionPoint } from '@/schemas/adminAid'
import { SETUP_BLUE, SETUP_FONT } from './setupStyles'

interface TargetGroupsSectionProps {
  form: AdminAidDistributionPoint
  onChange: <K extends keyof AdminAidDistributionPoint>(
    key: K,
    value: AdminAidDistributionPoint[K],
  ) => void
}

export default function TargetGroupsSection({
  form,
  onChange,
}: TargetGroupsSectionProps) {
  function toggleGroup(group: string) {
    const next = form.targetGroups.includes(group)
      ? form.targetGroups.filter((g) => g !== group)
      : [...form.targetGroups, group]
    onChange('targetGroups', next)
  }

  return (
    <SetupSectionCard title="الفئات المستهدفة">
      <div className="flex flex-wrap justify-start gap-2">
        {ADMIN_AID_TARGET_GROUPS.map((group) => {
          const selected = form.targetGroups.includes(group)
          return (
            <button
              key={group}
              type="button"
              onClick={() => toggleGroup(group)}
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all"
              style={{
                fontFamily: SETUP_FONT,
                background: selected ? SETUP_BLUE : '#F1F5F9',
                color: selected ? '#fff' : '#64748B',
              }}
            >
              {selected && <Check size={14} strokeWidth={3} />}
              {group}
            </button>
          )
        })}
      </div>
    </SetupSectionCard>
  )
}
