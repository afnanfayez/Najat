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

import { useRegisterStore } from '@/store/useRegisterStore'

const triggerCls =
  'flex !h-11 w-full box-border items-center justify-between rounded-[10px] border-none bg-white/95 px-4 py-0 text-right text-[16px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] sm:!h-[50px] sm:text-[15px] [&>span]:flex-1 [&>span]:text-right [&>span]:text-black'

const contentCls =
  'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[10px] border-none bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] text-right text-[14px] text-black'

const StepTwo = () => {
  const { formData, updateFormData, nextStep, fieldErrors, validateStep, isSubmitting } = useRegisterStore()
  
  const handleSubmit = async (e) => {
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

    const isValid = await validateStep(2)
    if (isValid) {
      nextStep()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[580px] space-y-3 sm:space-y-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            الجنس
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => updateFormData({ gender: value })}
            dir="rtl"
          >
            <SelectTrigger className={`${triggerCls} ${fieldErrors.gender ? 'border-2 border-red-500' : 'border-none'}`}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent
              className={contentCls}
              dir="rtl"
              position="popper"
              sideOffset={4}
              avoidCollisions={false}
            >
              <SelectItem
                value="male"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                ذكر
              </SelectItem>
              <SelectItem
                value="female"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                أنثى
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            العمر
          </Label>
          <Select
            value={formData.age}
            onValueChange={(value) => updateFormData({ age: value })}
            dir="rtl"
          >
            <SelectTrigger className={`${triggerCls} ${fieldErrors.ageGroup ? 'border-2 border-red-500' : 'border-none'}`}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent
              className={contentCls}
              dir="rtl"
              position="popper"
              sideOffset={4}
              avoidCollisions={false}
            >
              <SelectItem
                value="under-18"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                أقل من 18 عام
              </SelectItem>
              <SelectItem
                value="18-40"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                من 18 عام الى 40 عام
              </SelectItem>
              <SelectItem
                value="40+"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                من 40 عام فما فوق
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            الحالة الاجتماعية
          </Label>
          <Select
            value={formData.maritalStatus}
            onValueChange={(value) => updateFormData({ maritalStatus: value })}
            dir="rtl"
          >
            <SelectTrigger className={`${triggerCls} ${fieldErrors.maritalStatus ? 'border-2 border-red-500' : 'border-none'}`}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent
              className={contentCls}
              dir="rtl"
              position="popper"
              sideOffset={4}
              avoidCollisions={false}
            >
              <SelectItem
                value="single"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                اعزب
              </SelectItem>
              <SelectItem
                value="married"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                متزوج
              </SelectItem>
              <SelectItem
                value="divorced"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                مطلق
              </SelectItem>
              <SelectItem
                value="widowed"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                ارمل
              </SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.maritalStatus && (
            <p className="mt-1 text-right text-[12px] font-bold text-red-500">{fieldErrors.maritalStatus}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            الحالة الصحية
          </Label>
          <Select
            value={formData.healthStatus}
            onValueChange={(value) => updateFormData({ healthStatus: value })}
            dir="rtl"
          >
            <SelectTrigger className={`${triggerCls} ${fieldErrors.healthStatus ? 'border-2 border-red-500' : 'border-none'}`}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent
              className={contentCls}
              dir="rtl"
              position="popper"
              sideOffset={4}
              avoidCollisions={false}
            >
              <SelectItem
                value="good"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                بصحة جيدة
              </SelectItem>
              <SelectItem
                value="chronic"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                مريض مزمن
              </SelectItem>
              <SelectItem
                value="injured"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                مصاب
              </SelectItem>
              <SelectItem
                value="amputated"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                مبتور
              </SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.healthStatus && (
            <p className="mt-1 text-right text-[12px] font-bold text-red-500">{fieldErrors.healthStatus}</p>
          )}
        </div>
      </div>

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
          onChange={(e) => updateFormData({ identityNumber: e.target.value })}
          placeholder="اكتب رقم الهوية (9 أرقام)"
          className={`h-11 rounded-[10px] bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px] ${fieldErrors.identityNumber ? 'border-2 border-red-500' : 'border-none'}`}
        />
        {fieldErrors.identityNumber && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{fieldErrors.identityNumber}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mx-auto mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px]"
        style={{ lineHeight: '100%' }}
      >
        {isSubmitting ? 'جاري التحقق...' : 'التالي'}
      </Button>
    </form>
  )
}

export default StepTwo
