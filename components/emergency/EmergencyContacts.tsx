'use client'

import React from 'react'
import { PhoneCall, Shield, Truck, Ambulance } from 'lucide-react'

interface ContactCardProps {
  number: string
  title: string
  subtitle: string
  icon: React.ReactNode
}

function ContactCard({ number, title, subtitle, icon }: ContactCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 p-5 flex flex-col transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl font-bold text-red-500" dir="ltr">{number}</span>
        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="flex flex-col text-right mb-6">
        <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
        <p className="text-slate-500 text-xs">{subtitle}</p>
      </div>

      <a
        href={`tel:${number}`}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <PhoneCall size={16} />
        اتصل الآن
      </a>
    </div>
  )
}

export default function EmergencyContacts() {
  return (
    <div className="w-full" dir="rtl">
      <h2 className="text-xl font-bold text-slate-800 mb-6 text-right">أرقام الطوارئ السريعة</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContactCard 
          number="101"
          title="الإسعاف"
          subtitle="للحالات الطبية الحرجة والحوادث"
          icon={<Ambulance size={24} />}
        />
        <ContactCard 
          number="102"
          title="الدفاع المدني"
          subtitle="للحرائق وعمليات الإنقاذ"
          icon={<Truck size={24} />}
        />
        <ContactCard 
          number="100"
          title="الشرطة"
          subtitle="للجرائم والتدخل الأمني السريع"
          icon={<Shield size={24} />}
        />
      </div>
    </div>
  )
}
