'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'

export default function EditHeader() {
  const [name, setName] = useState('أحمد محمد علي')
  const [idNumber, setIdNumber] = useState('1098725431')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        {/* Avatar with Edit Badge */}
        <div className="relative shrink-0 z-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
            <Image 
              src="/assets/profile_avatar.png" 
              alt="Profile Avatar" 
              width={128} 
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap">
            <Camera size={14} />
            تعديل
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
          {/* Name Input */}
          <div className="flex flex-col w-full md:w-64">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1 text-center md:text-right">الاسم</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-center md:text-right font-bold text-slate-800 bg-white border border-blue-200 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* ID Input */}
          <div className="flex flex-col w-full md:w-64">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1 text-center md:text-right">رقم الهوية</label>
            <input 
              type="text" 
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full text-center md:text-right font-bold text-slate-800 bg-white border border-blue-200 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors">
        حفظ التعديلات
      </button>
    </div>
  )
}
