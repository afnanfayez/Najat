'use client'

import React from 'react'
import { Droplet } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function ProfileStatsRow() {
  const { user } = useAuth()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
        <h3 className="text-blue-500 text-sm font-semibold mb-2">طلبات المساعدة</h3>
        <span className="text-3xl font-bold text-slate-800">—</span>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
        <h3 className="text-blue-500 text-sm font-semibold mb-2">جهة اتصال الطوارئ</h3>
        <span className="text-xl font-bold text-slate-800" dir="ltr">
          {user?.phoneNumber ?? '—'}
        </span>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center relative">
         <div className="absolute top-4 left-4 text-blue-500">
            <Droplet size={20} />
         </div>
        <h3 className="text-blue-500 text-sm font-semibold mb-2">فصيلة الدم</h3>
        <span className="text-3xl font-bold text-red-500">O+</span>
      </div>
    </div>
  )
}
