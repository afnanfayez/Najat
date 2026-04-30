'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const triggerCls =
  'h-11 w-full rounded-[10px] border-none bg-white/95 pr-4 pl-3 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] sm:h-[50px] sm:text-[15px] [&>span]:flex-1 [&>span]:text-right [&>span]:text-black'

const contentCls =
  'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[10px] border-none bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] text-right text-[14px] text-black'

const StepTwo = ({ formData, setFormData, onBack, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const requiredFields = [
      formData.gender,
      formData.age,
      formData.maritalStatus,
      formData.healthStatus,
      formData.identityNumber,
    ]

    if (requiredFields.some((value) => String(value ?? '').trim() === '')) {
      toast.error('يرجى تعبئة الحقول المطلوبة ')
      return
    }

    onNext()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[580px] space-y-3 sm:space-y-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {/* الجنس */}
        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            الجنس
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
            dir="rtl"
          >
            <SelectTrigger className={triggerCls}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent className={contentCls} dir="rtl" position="popper" sideOffset={4}>
              <SelectItem value="male" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                ذكر
              </SelectItem>
              <SelectItem value="female" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                أنثى
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* العمر */}
        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            العمر
          </Label>
          <Select
            value={formData.age}
            onValueChange={(value) => setFormData({ ...formData, age: value })}
            dir="rtl"
          >
            <SelectTrigger className={triggerCls}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent className={contentCls} dir="rtl" position="popper" sideOffset={4}>
              <SelectItem value="under-18" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                أقل من 18 عام
              </SelectItem>
              <SelectItem value="18-40" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                من 18 عام الى 40 عام
              </SelectItem>
              <SelectItem value="40+" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                من 40 عام فما فوق
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* الحالة الاجتماعية */}
        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            الحالة الاجتماعية
          </Label>
          <Select
            value={formData.maritalStatus}
            onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
            dir="rtl"
          >
            <SelectTrigger className={triggerCls}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent className={contentCls} dir="rtl" position="popper" sideOffset={4}>
              <SelectItem value="single" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                اعزب
              </SelectItem>
              <SelectItem value="married" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                متزوج
              </SelectItem>
              <SelectItem value="divorced" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                مطلق
              </SelectItem>
              <SelectItem value="widowed" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                ارمل
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* الحالة الصحية */}
        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            الحالة الصحية
          </Label>
          <Select
            value={formData.healthStatus}
            onValueChange={(value) => setFormData({ ...formData, healthStatus: value })}
            dir="rtl"
          >
            <SelectTrigger className={triggerCls}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent className={contentCls} dir="rtl" position="popper" sideOffset={4}>
              <SelectItem value="good" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                بصحة جيدة
              </SelectItem>
              <SelectItem value="chronic" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                مريض مزمن
              </SelectItem>
              <SelectItem value="injured" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                مصاب
              </SelectItem>
              <SelectItem value="amputated" className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50">
                مبتور
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* رقم الهوية */}
      <div className="space-y-1.5">
        <Label
          htmlFor="identityNumber"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          رقم الهوية
        </Label>
        <Input
          id="identityNumber"
          type="text"
          value={formData.identityNumber}
          onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value })}
          placeholder="اكتب رقم الهوية"
          className="h-11 rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px]"
        />
      </div>

      <Button
        type="submit"
        className="mx-auto mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px]"
        style={{ lineHeight: '100%' }}
      >
        التالي
      </Button>
    </form>
  )
}

export default StepTwo
