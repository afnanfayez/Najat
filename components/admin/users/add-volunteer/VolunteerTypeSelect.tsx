'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { FORM_BLUE, FORM_FONT, FORM_INPUT_BG, VOLUNTEER_TYPE_OPTIONS } from './types'

interface Props {
  selected: string[]
  onChange: (values: string[]) => void
}

export default function VolunteerTypeSelect({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  function remove(value: string, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const selectedLabels = VOLUNTEER_TYPE_OPTIONS.filter((o) => selected.includes(o.value))

  return (
    <div ref={ref} className="relative text-right">
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
        className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-all select-none"
        style={{
          background: FORM_INPUT_BG,
          fontFamily: FORM_FONT,
          border: open ? `1.5px solid ${FORM_BLUE}` : '1.5px solid transparent',
        }}
      >
        {/* Selected chips or placeholder */}
        <div className="flex flex-1 flex-wrap gap-1.5">
          {selectedLabels.length === 0 ? (
            <span style={{ color: '#94A3B8', fontFamily: FORM_FONT }}>نوع التطوع</span>
          ) : (
            selectedLabels.map((opt) => (
              <span
                key={opt.value}
                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ background: '#459F49', fontFamily: FORM_FONT }}
              >
                {opt.label}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => remove(opt.value, e as any)}
                  onKeyDown={(e) => e.key === 'Enter' && remove(opt.value, e as any)}
                  className="cursor-pointer opacity-80 hover:opacity-100"
                  aria-label={`إزالة ${opt.label}`}
                >
                  <X size={11} strokeWidth={2.5} />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: '#94A3B8' }}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#E8EEF5] bg-white shadow-lg"
          style={{ fontFamily: FORM_FONT }}
        >
          {VOLUNTEER_TYPE_OPTIONS.map((opt, i) => {
            const checked = selected.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-right transition-colors hover:bg-[#F0F9FF] ${
                  i !== 0 ? 'border-t border-[#F1F5F9]' : ''
                }`}
              >
                {/* Checkbox */}
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors"
                  style={{
                    borderColor: checked ? FORM_BLUE : '#CBD5E1',
                    background: checked ? FORM_BLUE : 'white',
                  }}
                >
                  {checked && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>

                {/* Label + description */}
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-[#1e293b]">{opt.label}</span>
                  <span className="text-xs text-[#94A3B8]">{opt.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
