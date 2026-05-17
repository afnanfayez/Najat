'use client'

import React from 'react'
import { Siren } from 'lucide-react'

export default function SOSButton() {
  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* Background glowing ripples */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-400/10 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      
      {/* Main Button */}
      <button 
        className="relative z-10 w-64 h-64 bg-[#F44336] hover:bg-[#E53935] text-white rounded-full flex flex-col items-center justify-center gap-2 shadow-[0_0_40px_rgba(244,67,54,0.6)] transition-transform hover:scale-105 active:scale-95"
      >
        <Siren size={48} strokeWidth={2.5} />
        <span className="text-5xl font-bold tracking-wider mt-2">SOS</span>
        <span className="text-lg font-bold">طلب استغاثة</span>
      </button>

      <p className="mt-12 text-sm font-bold text-slate-800 text-center">
        سيتم إرسال موقعك الحالي وتنبيه السلطات فور الضغط
      </p>
    </div>
  )
}
