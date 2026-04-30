'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const StepThree = ({ formData, setFormData, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const requiredFields = [
      formData.currentMembers,
      formData.maleCount,
      formData.femaleCount,
      formData.region,
    ]

    if (requiredFields.some((value) => String(value ?? '').trim() === '')) {
      toast.error('يرجى تعبئة جميع حقول الخطوة الثالثة', {
        description: 'أدخل عدد الأفراد الحالي، عدد الذكور، عدد الإناث، والمنطقة أو المحافظة.',
      })
      return
    }

    onNext()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[580px] space-y-4 sm:space-y-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="currentMembers" className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            عدد الأفراد الحالي
          </Label>
          <Input
            id="currentMembers"
            type="number"
            min="1"
            value={formData.currentMembers}
            onChange={(e) => setFormData({ ...formData, currentMembers: e.target.value })}
            placeholder="عدد الأفراد"
            className="h-11 rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="region" className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            المنطقة/المحافظة
          </Label>
          <Input
            id="region"
            type="text"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            placeholder="اكتب اسم المحافظة"
            className="h-11 rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="maleCount" className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            عدد الذكور
          </Label>
          <Input
            id="maleCount"
            type="number"
            min="0"
            value={formData.maleCount}
            onChange={(e) => setFormData({ ...formData, maleCount: e.target.value })}
            placeholder="عدد الذكور"
            className="h-11 rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="femaleCount" className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            عدد الإناث
          </Label>
          <Input
            id="femaleCount"
            type="number"
            min="0"
            value={formData.femaleCount}
            onChange={(e) => setFormData({ ...formData, femaleCount: e.target.value })}
            placeholder="عدد الإناث"
            className="h-11 rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px]"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="mx-auto mt-4 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px]"
        style={{ lineHeight: '100%' }}
      >
        التالي
      </Button>
    </form>
  )
}

export default StepThree
