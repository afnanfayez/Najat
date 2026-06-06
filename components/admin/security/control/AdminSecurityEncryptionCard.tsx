'use client'

import { EyeOff, Image, Lock } from 'lucide-react'
import type { AdminSecurityEncryptionProtocol } from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_BLUE,
  ADMIN_SECURITY_CARD_SHELL,
  ADMIN_SECURITY_CARD_SHADOW,
  ADMIN_SECURITY_FONT,
  ADMIN_SECURITY_PROTOCOL_STATUS,
} from '../adminSecurityStyles'

interface AdminSecurityEncryptionCardProps {
  title: string
  protocols: AdminSecurityEncryptionProtocol[]
  advancedPrivacyLabel: string
  onAdvancedPrivacy?: () => void
}

function ProtocolIcon({
  icon,
  active,
}: {
  icon: AdminSecurityEncryptionProtocol['icon']
  active: boolean
}) {
  const bg = active ? '#E8F5E9' : '#F1F5F9'
  const color = active ? '#22C55E' : '#94A3B8'

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{ background: bg }}
    >
      {icon === 'lock' && <Lock size={18} style={{ color }} strokeWidth={1.75} />}
      {icon === 'vault' && <Image size={18} style={{ color }} strokeWidth={1.75} />}
      {icon === 'mask' && <EyeOff size={18} style={{ color }} strokeWidth={1.75} />}
    </span>
  )
}

export default function AdminSecurityEncryptionCard({
  title,
  protocols,
  advancedPrivacyLabel,
  onAdvancedPrivacy,
}: AdminSecurityEncryptionCardProps) {
  return (
    <section
      className={`${ADMIN_SECURITY_CARD_SHELL} min-w-0`}
      style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
      dir="rtl"
    >
      <h3 className="mb-2.5 break-words text-right text-base font-bold text-[#0F172A]">{title}</h3>

      <div className="mb-3 flex flex-col gap-2">
        {protocols.map((protocol) => {
          const active = protocol.status === 'active'
          const tone = ADMIN_SECURITY_PROTOCOL_STATUS[protocol.status]
          return (
            <div
              key={protocol.id}
              className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
              style={{ background: '#F8FAFC' }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <ProtocolIcon icon={protocol.icon} active={active} />
                <div className="min-w-0 text-right">
                  <p
                    className="break-words text-sm font-bold leading-tight"
                    style={{ color: active ? '#0F172A' : '#94A3B8' }}
                  >
                    {protocol.name}
                  </p>
                  <p
                    className="break-words text-[11px] font-medium leading-tight"
                    style={{ color: active ? '#94A3B8' : '#CBD5E1' }}
                  >
                    {protocol.sublabel}
                  </p>
                </div>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                style={{ background: tone.bg, color: tone.text }}
              >
                {active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onAdvancedPrivacy}
        className="w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white sm:text-sm"
        style={{ background: ADMIN_SECURITY_BLUE, fontFamily: ADMIN_SECURITY_FONT }}
      >
        {advancedPrivacyLabel}
      </button>
    </section>
  )
}
