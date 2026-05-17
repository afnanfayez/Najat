import React from 'react'
import SOSButton from './SOSButton'
import EmergencyContacts from './EmergencyContacts'
import EmergencyProcedures from './EmergencyProcedures'
import MobileSimpleHeader from '../dashboard/header/MobileSimpleHeader'

export default function EmergencyContent() {
  return (
    <div className="w-full flex flex-col items-center gap-10 pb-12">
      <MobileSimpleHeader />
      
      {/* Header and SOS Section */}
      <div className="w-full text-center mt-6">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">مركز طوارئ المواطن</h1>
        <p className="text-slate-600 text-sm font-semibold">نحن هنا لمساعدتك في أوقات الأزمات. الرجاء اختيار الخدمة المطلوبة أو الضغط على زر الاستغاثة الفوري.</p>
        
        <div className="mt-8">
          <SOSButton />
        </div>
      </div>

      {/* Emergency Contacts */}
      <EmergencyContacts />

      {/* Emergency Procedures */}
      <EmergencyProcedures />
      
    </div>
  )
}
