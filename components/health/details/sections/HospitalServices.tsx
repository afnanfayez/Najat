'use client'

import React from 'react'
import { Activity, Baby, Stethoscope, Eye, Monitor, Pill, Droplets, Sparkles, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'

const SERVICES = [
  { label: 'النساء والولادة', icon: Baby },
  { label: 'الأسنان', icon: Stethoscope },
  { label: 'العيون', icon: Eye },
  { label: 'العظام', icon: Activity },
  { label: 'التصوير التلفزيوني', icon: Monitor },
  { label: 'الجراحة العامة', icon: Pill },
  { label: 'المسالك البولية', icon: Droplets },
  { label: 'السكر والغدد', icon: Activity },
  { label: 'جراحة التجميل', icon: Sparkles },
  { label: 'الجلدية والعناية بالبشرة', icon: Heart },
]

export default function HospitalServices() {
  return (
    <Card className="hdv-services-card p-5 rounded-[28px] border-2 border-slate-100 shadow-md bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-2 flex-shrink-0">
        <Activity size={22} className="text-[#2196F3]" />
        <h3 className="text-lg font-black text-slate-800">الخدمات الطبية المتاحة</h3>
      </div>
      <div className="hdv-services-inner flex flex-wrap gap-2 sm:gap-3 justify-start no-scrollbar">
        {SERVICES.map((service, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 border-[#2196F3] bg-white shadow-sm hover:bg-blue-50 transition-all cursor-default">
            <service.icon size={16} className="text-[#F2A122] sm:w-[18px] sm:h-[18px]" />
            <span className="text-[12px] sm:text-[14px] font-black text-slate-700">{service.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
