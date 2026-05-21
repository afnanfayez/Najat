'use client'

interface AdminUsersToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function AdminUsersToggle({
  checked,
  onChange,
  disabled = false,
}: AdminUsersToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative h-[20px] w-[34px] shrink-0 rounded-full border-none p-0 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      style={{ background: checked ? '#22C55E' : '#F44336' }}
    >
      <span
        className="absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200"
        style={{ left: checked ? '16px' : '2px' }}
      />
    </button>
  )
}
