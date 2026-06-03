'use client'

import { Clock } from 'lucide-react'
import { useId, useRef } from 'react'
import { SETUP_FONT, SETUP_INPUT_BG } from './setupStyles'

interface AidTimeFieldProps {
  value: string
  onChange: (value: string) => void
}

function parseTime(value: string): { hours: number; minutes: number } {
  const [h = '0', m = '0'] = value.split(':')
  return {
    hours: Number.parseInt(h, 10) || 0,
    minutes: Number.parseInt(m, 10) || 0,
  }
}

function formatTimeDisplay(value: string): { time: string; period: string } {
  const { hours, minutes } = parseTime(value)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  const mm = String(minutes).padStart(2, '0')
  return {
    time: `${String(hour12).padStart(2, '0')}:${mm}`,
    period,
  }
}

export default function AidTimeField({ value, onChange }: AidTimeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const { time, period } = formatTimeDisplay(value)

  function openPicker() {
    inputRef.current?.showPicker?.()
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full" dir="rtl">
      <button
        type="button"
        onClick={openPicker}
        className="flex h-11 w-full items-center justify-start gap-2 rounded-xl pr-3 pl-3 text-right transition-opacity hover:opacity-90"
        style={{ background: SETUP_INPUT_BG, fontFamily: SETUP_FONT }}
        aria-labelledby={inputId}
      >
        <span className="text-sm font-bold text-[#1E293B]">{time}</span>
        <span className="text-sm font-bold text-[#64748B]">{period}</span>
        <Clock size={18} className="shrink-0 text-[#2196F3]" strokeWidth={2} />
      </button>

      <input
        ref={inputRef}
        id={inputId}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  )
}
