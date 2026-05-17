'use client'

import React from 'react'
import { Home, User, Phone } from 'lucide-react'

export default function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Saved Locations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-5 text-right">المواقع المحفوظة</h3>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center text-right">
            <div className="flex flex-col">
              <span className="text-blue-500 font-semibold text-sm">المنزل الرئيسي</span>
              <span className="text-slate-500 text-xs">شارع الشفاء غزة</span>
            </div>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
              <Home size={16} />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-right">
             <div className="flex flex-col">
              <span className="text-blue-500 font-semibold text-sm">عدد الافراد</span>
              <span className="text-slate-800 font-bold text-sm">4</span>
            </div>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>

          <div className="flex justify-between items-center text-right">
             <div className="flex flex-col">
              <span className="text-blue-500 font-semibold text-sm">رقم الهاتف</span>
              <span className="text-slate-800 font-bold text-sm" dir="ltr">0591234567</span>
            </div>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
              <Phone size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Medical Details */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
         <h3 className="text-sm font-bold text-slate-800 mb-5 text-right">التفاصيل الطبية</h3>
         <div className="flex flex-col gap-4 text-right">
            <div className="flex flex-col gap-1">
              <span className="text-blue-500 text-xs font-semibold">الحساسية</span>
              <span className="text-slate-800 text-sm font-semibold">حساسية من البنسلين</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-blue-500 text-xs font-semibold">الأمراض المزمنة</span>
              <span className="text-slate-800 text-sm font-semibold">ضغط الدم المرتفع</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-blue-500 text-xs font-semibold">الأدوية الحالية</span>
              <span className="text-slate-800 text-sm font-semibold">أملوديبين (5 ملغ)</span>
            </div>
         </div>
      </div>

      {/* App Usage Count */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 text-center flex flex-col items-center justify-center py-6">
         <h3 className="text-sm font-bold text-slate-800 mb-3 text-right w-full">عدد مرات استخدام التطبيق</h3>
         <span className="text-4xl font-bold text-blue-500">15</span>
      </div>

    </div>
  )
}
