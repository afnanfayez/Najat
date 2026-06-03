'use client'

import { ADMIN_MAPS_BLUE, ADMIN_MAPS_FONT } from '../adminMapsStyles'

export type AdminMapsEditorMobileTab = 'map' | 'tools' | 'feed'

const TABS: { id: AdminMapsEditorMobileTab; label: string }[] = [
  { id: 'map', label: 'الخريطة' },
  { id: 'tools', label: 'الأدوات' },
  { id: 'feed', label: 'البلاغات' },
]

interface AdminMapsEditorMobileTabsProps {
  active: AdminMapsEditorMobileTab
  onChange: (tab: AdminMapsEditorMobileTab) => void
}

export default function AdminMapsEditorMobileTabs({
  active,
  onChange,
}: AdminMapsEditorMobileTabsProps) {
  return (
    <div
      className="sticky top-0 z-20 mb-3 grid grid-cols-3 gap-1 rounded-xl bg-[#F1F5F9] p-1 xl:hidden"
      dir="rtl"
    >
      {TABS.map((tab) => {
        const selected = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="rounded-lg py-2.5 text-xs font-bold transition-all sm:text-sm"
            style={{
              fontFamily: ADMIN_MAPS_FONT,
              background: selected ? ADMIN_MAPS_BLUE : 'transparent',
              color: selected ? '#fff' : '#64748B',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
