'use client'

import React from 'react'
import { HelpCircle, HeadphonesIcon, ShieldAlert, MessageSquare } from 'lucide-react'

export default function HelpAndSupport() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-right">
       <h3 className="text-lg font-bold text-slate-800 mb-1">المساعدة والدعم</h3>
       <p className="text-slate-500 text-sm mb-6">نحن هنا لمساعدتك في أي وقت، تواصل معنا عبر القنوات التالية</p>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-end gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 transition-colors group">
             <div className="flex flex-col text-right">
               <span className="font-bold text-slate-800 text-sm group-hover:text-blue-500 transition-colors">الأسئلة الشائعة</span>
               <span className="text-slate-500 text-xs">إجابات سريعة لاستفساراتك</span>
             </div>
             <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                <HelpCircle size={18} />
             </div>
          </button>
          <button className="flex items-center justify-end gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 transition-colors group">
             <div className="flex flex-col text-right">
               <span className="font-bold text-slate-800 text-sm group-hover:text-blue-500 transition-colors">الدعم الفني</span>
               <span className="text-slate-500 text-xs">تحدث مع أحد ممثلينا</span>
             </div>
             <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                <HeadphonesIcon size={18} />
             </div>
          </button>
          <button className="flex items-center justify-end gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 transition-colors group">
             <div className="flex flex-col text-right">
               <span className="font-bold text-slate-800 text-sm group-hover:text-blue-500 transition-colors">سياسة الخصوصية</span>
               <span className="text-slate-500 text-xs">كيف نحمي بياناتك</span>
             </div>
             <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                <ShieldAlert size={18} />
             </div>
          </button>
          <button className="flex items-center justify-end gap-3 bg-blue-500 hover:bg-blue-600 rounded-xl p-4 transition-colors shadow-sm text-white">
             <div className="flex flex-col text-right">
               <span className="font-bold text-white text-sm">مركز بلاغات نجاة</span>
               <span className="text-blue-100 text-xs">متاح على مدار الساعة</span>
             </div>
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0">
                <MessageSquare size={18} />
             </div>
          </button>
       </div>
    </div>
  )
}
