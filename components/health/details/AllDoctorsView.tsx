'use client'

import React from 'react'
import { ArrowRight, Stethoscope, Clock, MapPin, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface AllDoctorsViewProps {
  hospital: any
  onBack: () => void
}

export default function AllDoctorsView({ hospital, onBack }: AllDoctorsViewProps) {
  return (
    <div className="flex flex-col gap-8 h-full overflow-y-auto no-scrollbar pb-10" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}>
      {/* Header with Title and Back */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
               <Stethoscope size={32} />
            </div>
            <div className="flex flex-col text-right">
               <h1 className="text-3xl font-black text-slate-800">الأطباء المناوبون</h1>
               <p className="text-slate-500 font-bold text-sm">قائمة بكافة التخصصات المناوبة في {hospital.name || "مستشفى أصدقاء المريض"}</p>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="relative w-64 h-12">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <Input 
                 placeholder="ابحث عن طبيب أو تخصص..." 
                 className="h-full pr-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
               />
            </div>
            <div 
              className="bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 text-blue-500 font-black cursor-pointer hover:bg-slate-50 transition-all"
              onClick={onBack}
            >
              <ArrowRight size={20} />
              <span>رجوع للتفاصيل</span>
            </div>
         </div>
      </div>

      {/* Main Grid of Doctors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'د. ناصر رأفت أبو شعبان', specialty: 'استشاري الجراحة العامة وجراحة المناظير', time: 'من 10:00 ص - 2:00 م', days: 'الأحد / الخميس' },
          { name: 'د. محمد صلاح اللولو', specialty: 'أخصائي عيون', time: 'من 1:30 ص - 5:00 م', days: 'السبت / الخميس' },
          { name: 'د. سلامة سعيد التتر', specialty: 'استشاري أمراض السكري والغدد', time: 'من 1:30 ص - 5:00 م', days: 'السبت / الخميس' },
          { name: 'د. شادي عبد الحكيم الحداد', specialty: 'أخصائي طب وجراحة الفم والأسنان', time: 'من 10:00 ص - 2:00 م', days: 'الأحد / الأربعاء' },
          { name: 'د. ناصر رأفت أبو شعبان', specialty: 'استشاري الجراحة العامة وجراحة المناظير', time: 'من 10:00 ص - 2:00 م', days: 'الأحد / الخميس' },
          { name: 'د. محمد صلاح اللولو', specialty: 'أخصائي عيون', time: 'من 1:30 ص - 5:00 م', days: 'السبت / الخميس' },
          { name: 'د. سلامة سعيد التتر', specialty: 'استشاري أمراض السكري والغدد', time: 'من 1:30 ص - 5:00 م', days: 'السبت / الخميس' },
          { name: 'د. شادي عبد الحكيم الحداد', specialty: 'أخصائي طب وجراحة الفم والأسنان', time: 'من 10:00 ص - 2:00 م', days: 'الأحد / الأربعاء' },
          { name: 'د. ناصر رأفت أبو شعبان', specialty: 'استشاري الجراحة العامة وجراحة المناظير', time: 'من 10:00 ص - 2:00 م', days: 'الأحد / الخميس' },
          { name: 'د. محمد صلاح اللولو', specialty: 'أخصائي عيون', time: 'من 1:30 ص - 5:00 م', days: 'السبت / الخميس' },
          { name: 'د. سلامة سعيد التتر', specialty: 'استشاري أمراض السكري والغدد', time: 'من 1:30 ص - 5:00 م', days: 'السبت / الخميس' },
          { name: 'د. شادي عبد الحكيم الحداد', specialty: 'أخصائي طب وجراحة الفم والأسنان', time: 'من 10:00 ص - 2:00 م', days: 'الأحد / الأربعاء' },
        ].map((doctor, i) => (
          <Card key={i} className="p-6 rounded-[24px] border-none shadow-sm bg-[#F4F9FF] flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm">
                 <Image src="/assets/doctor_avatar.png" alt="Doctor" fill className="object-cover" />
              </div>
              <div className="flex flex-col text-right">
                <h4 className="font-black text-slate-800 text-sm">{doctor.name}</h4>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{doctor.specialty}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-white/50 p-3 rounded-xl">
               <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400">مواعيد العمل أسبوعياً</span>
               </div>
               <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                  <span>{doctor.days.split(' / ')[0]}</span>
                  <span>{doctor.time}</span>
               </div>
               <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                  <span>{doctor.days.split(' / ')[1]}</span>
                  <span>{doctor.time}</span>
               </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600 font-bold text-xs h-10 mt-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">
               عرض الملف الشخصي
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
