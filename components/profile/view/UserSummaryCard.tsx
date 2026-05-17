'use client'

import React from 'react'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

export default function UserSummaryCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-right">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-slate-50 shrink-0">
          <Image 
            src="/assets/profile_avatar.png" 
            alt="Profile Avatar" 
            width={96} 
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col pt-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">أحمد محمد علي</h2>
          <p className="text-slate-500 text-sm mb-4">رقم الهوية: 1098725431</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
              آخر نشاط : الثلاثاء 5/5/2023
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
              مستفيد
            </span>
          </div>
        </div>
      </div>
      {/* Logout Button */}
      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors w-full md:w-auto">
        تسجيل خروج
        <LogOut size={16} />
      </button>
    </div>
  )
}
