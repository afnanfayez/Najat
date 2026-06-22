'use client'

export function PendingSyncBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-bold text-amber-600 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      قيد المزامنة
    </span>
  )
}
