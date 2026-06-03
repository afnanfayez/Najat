'use client'

import { PlusSquare } from 'lucide-react'
import { ADMIN_HEALTH_BLUE, ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface AdminHealthActionButtonProps {
  label: string
  onClick?: () => void
}

export default function AdminHealthActionButton({
  label,
  onClick,
}: AdminHealthActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
      style={{ background: ADMIN_HEALTH_BLUE, fontFamily: ADMIN_HEALTH_FONT }}
    >
      <PlusSquare size={20} strokeWidth={2.5} />
      {label}
    </button>
  )
}
