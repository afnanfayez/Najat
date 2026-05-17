'use client'

import React from 'react'
import { Cloud } from 'lucide-react'

export default function DataAndStorage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
       <div className="flex justify-end items-center gap-2 mb-6">
          <h3 className="text-lg font-bold text-slate-800">البيانات والتخزين</h3>
          <Cloud className="text-blue-500" size={20} />
       </div>
       
       <div className="flex flex-col gap-6">
          {/* Storage Bar */}
          <div className="flex flex-col gap-2">
             <div className="flex justify-between items-center text-xs font-bold text-blue-500">
               <span>128 MB / 500 MB</span>
               <span className="text-slate-600">التنبيهات</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex" dir="ltr">
               <div className="bg-blue-500 h-full w-[25%] rounded-full"></div>
             </div>
          </div>

          {/* Local Maps Toggle */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex flex-col text-right">
              <span className="font-bold text-slate-800 text-sm">خرائط محلية</span>
              <span className="text-slate-500 text-xs">العمل بدون إنترنت</span>
            </div>
            <button type="button" className="w-11 h-6 rounded-full bg-blue-500 transition-colors duration-200 relative shrink-0">
              <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm" />
            </button>
          </div>

          {/* Clear Cache Button */}
          <button className="w-full py-3 border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-full font-bold text-slate-800 transition-all">
            مسح التخزين المؤقت
          </button>
       </div>
    </div>
  )
}
