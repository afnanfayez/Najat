'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FORM_BLUE, FORM_FONT, FORM_INPUT_BG } from './types'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
}

export default function SelectField({ value, onChange, options, placeholder = 'اختر...' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      {/* Trigger — dir:ltr forces chevron left / text right regardless of parent direction */}
      <div
        role="button"
        tabIndex={0}
        dir="ltr"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
        className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl px-3 text-sm select-none"
        style={{
          background: FORM_INPUT_BG,
          fontFamily: FORM_FONT,
          border: open ? `1.5px solid ${FORM_BLUE}` : '1.5px solid transparent',
        }}
      >
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: '#94A3B8' }}
        />
        <span
          className="flex-1 text-right"
          style={{ color: selected ? '#334155' : '#94A3B8', fontFamily: FORM_FONT }}
        >
          {selected ? selected.label : placeholder}
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#E8EEF5] bg-white shadow-lg"
          style={{ fontFamily: FORM_FONT }}
        >
          {options.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              dir="rtl"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full px-4 py-3 text-right text-sm transition-colors hover:bg-[#F0F9FF] ${
                opt.value === value ? 'font-bold text-[#2196F3]' : 'text-[#334155]'
              } ${i !== 0 ? 'border-t border-[#F1F5F9]' : ''}`}
              style={{ fontFamily: FORM_FONT }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
