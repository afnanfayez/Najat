'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import type { AdminSecurityControlData } from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_BLUE,
  ADMIN_SECURITY_CARD_SHELL,
  ADMIN_SECURITY_CARD_SHADOW,
  ADMIN_SECURITY_FONT,
  ADMIN_SECURITY_INPUT_BG,
} from '../adminSecurityStyles'

interface AdminSecurityRolesCardProps {
  data: AdminSecurityControlData
  onAddRole?: () => void
  onSavePermissions?: (roleId: string) => void
}

export default function AdminSecurityRolesCard({
  data,
  onAddRole,
  onSavePermissions,
}: AdminSecurityRolesCardProps) {
  const [selectedRoleId, setSelectedRoleId] = useState(data.selectedRoleId)
  const selectedRole = data.roles.find((role) => role.id === selectedRoleId) ?? data.roles[0]

  return (
    <section
      className={`${ADMIN_SECURITY_CARD_SHELL} mb-3 min-w-0 sm:mb-4`}
      style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
      dir="rtl"
    >
      <div className="mb-4 flex flex-col gap-3 min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between">
        <h3 className="text-sm font-bold text-[#0F172A] sm:text-base">{data.rolesTitle}</h3>
        <button
          type="button"
          onClick={onAddRole}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white min-[560px]:w-auto sm:text-sm"
          style={{ background: ADMIN_SECURITY_BLUE, fontFamily: ADMIN_SECURITY_FONT }}
        >
          <Plus size={16} strokeWidth={2.5} />
          {data.addRoleLabel}
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        <div className="flex flex-col gap-1.5 lg:col-span-4">
          {data.roles.map((role) => {
            const active = selectedRoleId === role.id
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className="rounded-xl px-3 py-2.5 text-right transition-colors"
                style={{
                  background: active ? ADMIN_SECURITY_BLUE : '#F1F5F9',
                  color: active ? '#fff' : '#0F172A',
                }}
              >
                <p className="text-sm font-bold">{role.name}</p>
                <p
                  className="mt-0.5 text-[11px] font-medium"
                  style={{ color: active ? 'rgba(255,255,255,0.85)' : '#64748B' }}
                >
                  {role.description}
                </p>
              </button>
            )
          })}
        </div>

        <div
          className="rounded-xl border border-[#E8EEF5] p-3 sm:p-4 lg:col-span-8"
          style={{ background: '#FAFBFC' }}
        >
          <div className="mb-3 flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
            <div className="min-w-0 text-right">
              <h4 className="text-sm font-bold text-[#0F172A] sm:text-base">
                {selectedRole ? `أذونات ${selectedRole.name}` : data.permissionsTitle}
              </h4>
              <p className="mt-0.5 text-[11px] font-medium text-[#94A3B8] sm:text-xs">
                {data.permissionsSubtitle}
              </p>
            </div>
            <span
              className="self-start shrink-0 rounded-full px-3 py-1 text-[10px] font-bold sm:text-[11px]"
              style={{ background: '#E8F5E9', color: '#22C55E' }}
            >
              {data.authorizedBadge}
            </span>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2 min-[480px]:grid-cols-3">
            {data.permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-start gap-2 rounded-xl border border-[#E8EEF5] bg-white px-3 py-2"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background: '#E8F5E9' }}
                >
                  <Check size={14} className="text-[#22C55E]" strokeWidth={3} />
                </span>
                <span className="text-xs font-bold text-[#0F172A] sm:text-sm">
                  {permission.label}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSavePermissions?.(selectedRoleId)}
            className="w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white sm:py-3 sm:text-sm"
            style={{ background: ADMIN_SECURITY_BLUE, fontFamily: ADMIN_SECURITY_FONT }}
          >
            {data.savePermissionsLabel}
          </button>
        </div>
      </div>
    </section>
  )
}
