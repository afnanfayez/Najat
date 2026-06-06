'use client'

import { useState } from 'react'
import { Check, Cloud, HardDrive } from 'lucide-react'
import type {
  AdminSecurityScheduleOption,
  AdminSecurityStorageTarget,
} from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_BLUE,
  ADMIN_SECURITY_CARD_SHELL,
  ADMIN_SECURITY_CARD_SHADOW,
  ADMIN_SECURITY_FONT,
  ADMIN_SECURITY_INPUT_BG,
} from '../adminSecurityStyles'

interface AdminSecurityScheduleCardProps {
  scheduleTitle: string
  timelineTitle: string
  scheduleOptions: AdminSecurityScheduleOption[]
  selectedScheduleId: string
  storageTargetsTitle: string
  storageTargets: AdminSecurityStorageTarget[]
  updateScheduleLabel: string
  onUpdateSchedule?: (scheduleId: string, storageTargetIds: string[]) => void
}

function StorageTargetIcon({ icon }: { icon: AdminSecurityStorageTarget['icon'] }) {
  if (icon === 'cloud') return <Cloud size={24} className="text-[#2196F3]" strokeWidth={1.75} />
  return <HardDrive size={24} className="text-[#2196F3]" strokeWidth={1.75} />
}

export default function AdminSecurityScheduleCard({
  scheduleTitle,
  timelineTitle,
  scheduleOptions,
  selectedScheduleId: initialScheduleId,
  storageTargetsTitle,
  storageTargets: initialTargets,
  updateScheduleLabel,
  onUpdateSchedule,
}: AdminSecurityScheduleCardProps) {
  const [selectedScheduleId, setSelectedScheduleId] = useState(initialScheduleId)
  const [storageTargets, setStorageTargets] = useState(initialTargets)

  function toggleTarget(id: string) {
    setStorageTargets((prev) =>
      prev.map((target) =>
        target.id === id ? { ...target, active: !target.active } : target
      )
    )
  }

  function handleUpdate() {
    const activeIds = storageTargets.filter((t) => t.active).map((t) => t.id)
    onUpdateSchedule?.(selectedScheduleId, activeIds)
  }

  return (
    <section
      className={`${ADMIN_SECURITY_CARD_SHELL} py-3 sm:py-4`}
      style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
      dir="rtl"
    >
      <h3
        className="mb-2.5 text-right text-sm font-bold sm:text-base"
        style={{ color: ADMIN_SECURITY_BLUE }}
      >
        {scheduleTitle}
      </h3>

      <p className="mb-2 text-right text-xs font-bold text-[#0F172A] sm:text-sm">{timelineTitle}</p>

      <div className="mb-3 flex flex-col gap-1.5">
        {scheduleOptions.map((option) => {
          const active = selectedScheduleId === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedScheduleId(option.id)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-right transition-colors"
              style={{
                borderColor: active ? ADMIN_SECURITY_BLUE : '#E2E8F0',
                background: active ? ADMIN_SECURITY_INPUT_BG : '#fff',
              }}
            >
              <span className="min-w-0 flex-1 text-xs font-bold text-[#0F172A] sm:text-sm">
                {option.label}
              </span>
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: active ? '#22C55E' : '#CBD5E1',
                  background: active ? '#22C55E' : '#fff',
                }}
              >
                {active && <Check size={12} className="text-white" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mb-2 text-right text-xs font-bold text-[#0F172A] sm:text-sm">
        {storageTargetsTitle}
      </p>

      <div className="mb-3 grid grid-cols-2 gap-2">
        {storageTargets.map((target) => (
          <button
            key={target.id}
            type="button"
            onClick={() => toggleTarget(target.id)}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 transition-colors"
            style={{
              borderColor: target.active ? ADMIN_SECURITY_BLUE : '#E2E8F0',
              background: target.active ? ADMIN_SECURITY_INPUT_BG : '#fff',
            }}
          >
            <StorageTargetIcon icon={target.icon} />
            <span className="text-xs font-bold text-[#0F172A]">{target.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleUpdate}
        className="w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white sm:text-sm"
        style={{ background: ADMIN_SECURITY_BLUE, fontFamily: ADMIN_SECURITY_FONT }}
      >
        {updateScheduleLabel}
      </button>
    </section>
  )
}
