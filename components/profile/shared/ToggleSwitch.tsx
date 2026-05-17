'use client'

import React, { useState } from 'react'

interface ToggleSwitchProps {
  label: string
  defaultChecked?: boolean
}

export default function ToggleSwitch({ label, defaultChecked = false }: ToggleSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between w-full bg-slate-50 rounded-xl p-3 border border-slate-100">
      <span className="font-semibold text-slate-600 text-sm">{label}</span>
      <button
        type="button"
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${
          checked ? 'bg-blue-500' : 'bg-slate-300'
        }`}
        onClick={() => setChecked(!checked)}
      >
        <span
          className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all duration-200 shadow-sm ${
            checked ? 'left-1' : 'right-1'
          }`}
        />
      </button>
    </div>
  )
}
