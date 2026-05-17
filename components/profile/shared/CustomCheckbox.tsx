'use client'

import React from 'react'

interface CustomCheckboxProps {
  label: string
  sublabel: string
  checked: boolean
  onChange: () => void
}

export default function CustomCheckbox({ label, sublabel, checked, onChange }: CustomCheckboxProps) {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${checked ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
      onClick={onChange}
    >
      <div className="flex flex-col text-right">
        <span className="font-bold text-slate-800 text-sm">{label}</span>
        <span className="text-slate-500 text-xs">{sublabel}</span>
      </div>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${checked ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  )
}
