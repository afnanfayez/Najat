'use client'

import React, { useState } from 'react'
import { Edit2 } from 'lucide-react'

export default function EmergencySettings() {
  const [sosMessage, setSosMessage] = useState('')

  return (
    <div className="bg-red-50/50 rounded-xl shadow-sm border border-red-100 p-6 relative overflow-hidden">
       {/* Background decorative pattern can go here */}
       
       <div className="flex justify-end items-center gap-2 mb-6">
          <h3 className="text-lg font-bold text-red-500">إعدادات الطوارئ</h3>
          <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-bold text-xs shrink-0">!</div>
       </div>

       <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-slate-800 text-right">أرقام الاتصال السريع</h4>
          
          {/* Contact Item */}
          <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-red-100">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
               <Edit2 size={16} />
            </button>
            <div className="flex items-center gap-3">
               <div className="flex flex-col text-right">
                 <span className="font-bold text-slate-800 text-sm">محمد (الأب)</span>
                 <span className="text-slate-500 text-xs" dir="ltr">0505123456</span>
               </div>
               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               </div>
            </div>
          </div>

          {/* Add Contact Button */}
          <button className="w-full py-3 border-2 border-dashed border-red-300 hover:bg-red-50 rounded-xl font-bold text-red-500 transition-colors flex justify-center items-center">
            إضافة جهة اتصال جديدة
          </button>

          {/* SOS Message */}
          <div className="mt-2">
             <h4 className="text-sm font-bold text-slate-800 text-right mb-2">رسالة SOS مخصصة</h4>
             <textarea 
               className="w-full h-24 bg-white border border-red-100 rounded-xl p-4 text-right text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none text-slate-800"
               placeholder="أنا في حالة طوارئ, موقعي الحالي مرفق..."
               value={sosMessage}
               onChange={(e) => setSosMessage(e.target.value)}
             />
          </div>
       </div>
    </div>
  )
}
