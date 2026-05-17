'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { PhoneCall, HeartHandshake, Edit2 } from 'lucide-react'

export default function SettingsSupportRow() {
  const router = useRouter()

  return (
    <div className="bg-blue-100/50 rounded-xl p-6 flex flex-wrap items-center justify-between border border-blue-100">
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-1">الاعدادات والمساعدة</h3>
        <p className="text-slate-500 text-sm">متطوعونا والمتخصصون متاحون 24/7 للاستماع إليك.</p>
      </div>
      
      <div className="flex gap-6 items-center my-4 md:my-0">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 mb-2 shadow-sm">
            <PhoneCall size={20} />
          </div>
          <span className="text-sm text-slate-600 font-semibold" dir="ltr">1800-555-000</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 mb-2 shadow-sm">
            <HeartHandshake size={20} />
          </div>
          <span className="text-sm text-slate-600 font-semibold" dir="ltr">1800-555-111</span>
        </div>
      </div>

      <button 
        onClick={() => router.push('/profile/edit')}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-sm"
      >
        <Edit2 size={16} />
        تعديل الملف
      </button>
    </div>
  )
}
