import React from 'react'
import SOSButton from './SOSButton'
import EmergencyContacts from './EmergencyContacts'
import EmergencyProcedures from './EmergencyProcedures'
export default function EmergencyContent() {
  return (
    <>
      <div className="w-full flex flex-col gap-10 pb-12">
      
      {/* Header and SOS Section */}
      <div className="w-full flex flex-col items-center text-center mt-2 sm:mt-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">مركز طوارئ المواطن</h1>
        <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-sm">نحن هنا لمساعدتك في أوقات الأزمات. الرجاء اختيار الخدمة المطلوبة أو الضغط على زر الاستغاثة الفوري.</p>
        
        <div className="mt-8">
          <SOSButton />
        </div>
      </div>

      {/* Emergency Contacts */}
      <EmergencyContacts />

      {/* Emergency Procedures */}
      <EmergencyProcedures />
      
    </div>
    </>
  )
}
