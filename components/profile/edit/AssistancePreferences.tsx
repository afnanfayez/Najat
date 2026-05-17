'use client'

import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import CustomCheckbox from '../shared/CustomCheckbox'

export default function AssistancePreferences() {
  const [locationValue, setLocationValue] = useState('5')
  
  const [preferences, setPreferences] = useState({
    food: true,
    medicine: true,
    water: false,
    clothes: false,
    health: false,
    transport: false,
  })

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleIncrementLocation = () => setLocationValue(String(parseInt(locationValue || '0') + 1))
  const handleDecrementLocation = () => setLocationValue(String(Math.max(0, parseInt(locationValue || '0') - 1)))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
         <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">محدث منذ يومين</span>
         <div className="flex items-center gap-2">
           <h3 className="text-lg font-bold text-slate-800">تفضيلات المساعدات</h3>
           <span className="text-blue-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></span>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <CustomCheckbox label="غذاء" sublabel="طرود غذائية" checked={preferences.food} onChange={() => togglePreference('food')} />
        <CustomCheckbox label="دواء" sublabel="احتياجات طبية" checked={preferences.medicine} onChange={() => togglePreference('medicine')} />
        <CustomCheckbox label="ماء" sublabel="مياه صالحة للشرب" checked={preferences.water} onChange={() => togglePreference('water')} />
        <CustomCheckbox label="ملابس" sublabel="كسوة شتوية/صيفية" checked={preferences.clothes} onChange={() => togglePreference('clothes')} />
        <CustomCheckbox label="صحة" sublabel="كشوفات طبية" checked={preferences.health} onChange={() => togglePreference('health')} />
        <CustomCheckbox label="نقل" sublabel="توصيل للمراكز" checked={preferences.transport} onChange={() => togglePreference('transport')} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
         <div className="flex-1 w-full text-right">
            <label className="text-sm font-bold text-slate-800 mb-2 block">الموقع الحالي</label>
            <input type="text" placeholder="حدد موقعك الحالي" className="w-full bg-blue-50/50 border border-blue-100 rounded-lg py-3 px-4 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
         </div>
         <div className="w-full md:w-32">
            <label className="text-sm font-bold text-slate-800 mb-2 block text-center">الموقع الحالي</label>
            <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg p-1">
               <button type="button" className="w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-md transition-colors" onClick={handleDecrementLocation}>
                  <Minus size={16} />
               </button>
               <span className="font-bold text-slate-800">{locationValue}</span>
               <button type="button" className="w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-md transition-colors" onClick={handleIncrementLocation}>
                  <Plus size={16} />
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
