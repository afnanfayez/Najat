'use client'

import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
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
import { registerStepThreeSchema } from '@/schemas/registerStepThree'

const triggerCls =
  'flex !h-11 w-full box-border items-center justify-between rounded-[10px] border-none bg-white/95 px-4 py-0 text-right text-[16px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] sm:!h-[50px] sm:text-[15px] [&>span]:flex-1 [&>span]:text-right [&>span]:text-black'

const contentCls =
  'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[10px] border-none bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] text-right text-[14px] text-black'

const StepThree = () => {
  const { formData, updateFormData, nextStep, fieldErrors, clearErrors } = useRegisterStore()
  const [localErrors, setLocalErrors] = useState({})

  const getError = (field) => {
    if (localErrors[field]) return localErrors[field]
    if (fieldErrors[field]) return fieldErrors[field]
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalErrors({})

    const result = registerStepThreeSchema.safeParse({
      housingStatus: formData.housingStatus,
      currentMembers: formData.currentMembers,
      femaleCount: formData.femaleCount,
      maleCount: formData.maleCount,
      region: formData.region,
    })

    if (!result.success) {
      const errs = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0]
        if (field && !errs[field]) {
          errs[field] = err.message
        }
      })
      setLocalErrors(errs)
      toast.error('يرجى تعبئة جميع الحقول')
      return
    }

    clearErrors()
    nextStep()
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
            حالة السكن
          </Label>
          <Select
            value={formData.housingStatus}
            onValueChange={(value) => {
              updateFormData({ housingStatus: value })
              setLocalErrors((prev) => { const n = {...prev}; delete n.housingStatus; return n })
            }}
            dir="rtl"
          >
            <SelectTrigger className={`${triggerCls} ${getError('housingStatus') ? 'border-2 border-red-500' : 'border-none'}`}>
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
                value="owned"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                بيت ملك
              </SelectItem>
              <SelectItem
                value="rented"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                بيت إيجار
              </SelectItem>
              <SelectItem
                value="tent"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                خيمة
              </SelectItem>
              <SelectItem
                value="camp"
                className="cursor-pointer py-2.5 pr-8 pl-4 text-right text-[14px] hover:bg-gray-50 focus:bg-gray-50"
              >
                مخيم
              </SelectItem>
            </SelectContent>
          </Select>
          {getError('housingStatus') && (
            <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('housingStatus')}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="currentMembers"
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            عدد الافراد الحالي
          </Label>
          <Input
            id="currentMembers"
            type="number"
            min="1"
            value={formData.currentMembers}
            onChange={(e) => {
              updateFormData({ currentMembers: e.target.value })
              setLocalErrors((prev) => { const n = {...prev}; delete n.currentMembers; return n })
            }}
            placeholder="عدد الافراد"
            className={`h-11 rounded-[10px] bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px] ${getError('currentMembers') || getError('familyMembersCount') ? 'border-2 border-red-500' : 'border-none'}`}
          />
          {(getError('currentMembers') || getError('familyMembersCount')) && (
            <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('currentMembers') || getError('familyMembersCount')}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="femaleCount"
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            عدد الاناث
          </Label>
          <Input
            id="femaleCount"
            type="number"
            min="0"
            value={formData.femaleCount}
            onChange={(e) => {
              updateFormData({ femaleCount: e.target.value })
              setLocalErrors((prev) => { const n = {...prev}; delete n.femaleCount; return n })
            }}
            placeholder="عدد الاناث"
            className={`h-11 rounded-[10px] bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px] ${getError('femaleCount') ? 'border-2 border-red-500' : 'border-none'}`}
          />
          {getError('femaleCount') && (
            <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('femaleCount')}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="maleCount"
            className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            عدد الذكور
          </Label>
          <Input
            id="maleCount"
            type="number"
            min="0"
            value={formData.maleCount}
            onChange={(e) => {
              updateFormData({ maleCount: e.target.value })
              setLocalErrors((prev) => { const n = {...prev}; delete n.maleCount; return n })
            }}
            placeholder="عدد الذكور"
            className={`h-11 rounded-[10px] bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px] ${getError('maleCount') ? 'border-2 border-red-500' : 'border-none'}`}
          />
          {getError('maleCount') && (
            <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('maleCount')}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="region"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          المنطقة/المحافظة
        </Label>
        <div className="relative">
          <Input
            id="region"
            type="text"
            value={formData.region}
            onChange={(e) => {
              updateFormData({ region: e.target.value })
              setLocalErrors((prev) => { const n = {...prev}; delete n.region; return n })
            }}
            placeholder="اكتب اسم المحافظة"
            className={`h-11 rounded-[10px] bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px] ${getError('region') ? 'border-2 border-red-500' : 'border-none'}`}
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <MapPin className="h-5 w-5 text-[#2496FF]" />
          </div>
        </div>
        {getError('region') && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('region')}</p>
        )}
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

export default StepThree
