'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface HospitalDetailFooterProps {
  onBack: () => void
}

export default function HospitalDetailFooter({ onBack }: HospitalDetailFooterProps) {
  return (
    <div className="w-full px-1 flex justify-center mt-6 mb-2">
      <Card className="w-full h-auto xl:h-[100px] rounded-[24px] xl:rounded-[40px] border-2 border-slate-100 shadow-md bg-white p-0 overflow-hidden">
        <div className="flex flex-col xl:flex-row items-center justify-between h-full py-5 xl:py-0 px-4 sm:px-8 gap-5 xl:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full xl:w-auto justify-center xl:justify-start">
            <div className="relative w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] flex-shrink-0">
              <Image src="/assets/logo1.png" alt="Health Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col text-center sm:text-right">
              <h4 className="text-[16px] sm:text-[18px] xl:text-[21px] font-[900] text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>منصة نجاة للخدمات الإنسانية والطوارئ</h4>
              <p className="text-slate-500 text-[13px] sm:text-[15px] xl:text-[16px] font-[800] mt-1" style={{ fontFamily: "'Cairo', sans-serif" }}>دليلك الصحي في قطاع غزة</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
            <Button onClick={onBack} className="w-full sm:w-auto bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-[900] px-6 xl:px-8 py-6 xl:py-7 rounded-full text-[14px] xl:text-[17px] shadow-none" style={{ fontFamily: "'Cairo', sans-serif" }}>
              رجوع للخدمات الصحية
            </Button>
            <Button className="w-full sm:w-auto bg-[#EF4444] hover:bg-[#DC2626] text-white font-[900] px-6 xl:px-10 py-6 xl:py-7 rounded-full text-[14px] xl:text-[17px] shadow-none" style={{ fontFamily: "'Cairo', sans-serif" }}>
              اتصال بالطوارئ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
