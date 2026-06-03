'use client'

import React from 'react'
import { Settings } from 'lucide-react'
import ToggleSwitch from '../shared/ToggleSwitch'

export default function GeneralSettings() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-start items-center gap-2 mb-6">
        <h3 className="text-lg font-bold text-slate-800">الإعدادات العامة</h3>
        <Settings className="text-blue-500" size={20} />
      </div>

      <div className="flex flex-col gap-6">
        {/* Language Row */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-600">اللغة المفضلة</span>
          <div className="flex bg-slate-100 p-1 rounded-full w-48">
            <button className="flex-1 bg-blue-500 text-white text-sm font-semibold py-1.5 rounded-full shadow-sm">العربية</button>
            <button className="flex-1 text-slate-600 hover:bg-slate-200/50 text-sm font-semibold py-1.5 rounded-full transition-colors">English</button>
          </div>
        </div>

        {/* Toggles Row */}
        <div className="flex flex-col md:flex-row gap-4">
           <ToggleSwitch label="تنبيهات الطوارئ فقط" defaultChecked={true} />
        </div>

        {/* Text Size */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-4">
           <span className="font-semibold text-slate-600">حجم الخط</span>
           <div className="flex items-center gap-8 text-sm font-semibold text-slate-500">
              <span className="cursor-pointer hover:text-blue-500 transition-colors">صغير</span>
              <div className="flex flex-col items-center gap-1 cursor-pointer text-blue-500">
                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                 <span>متوسط</span>
              </div>
              <span className="cursor-pointer hover:text-blue-500 transition-colors">كبير</span>
           </div>
        </div>
      </div>
    </div>
  )
}
