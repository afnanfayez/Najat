'use client'

import React from 'react'
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

const StepTwo = ({ formData, setFormData, onNext }) => {
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
      toast.error('يرجى تعبئة جميع حقول الخطوة الثانية', {
        description: 'اختر الجنس والعمر والحالة الاجتماعية والصحية، ثم اكتب رقم الهوية.',
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
          <Label className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            الجنس
          </Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger className="h-11 w-full rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] sm:h-[50px] sm:text-[15px]">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">ذكر</SelectItem>
              <SelectItem value="female">أنثى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            العمر
          </Label>
          <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
            <SelectTrigger className="h-11 w-full rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] sm:h-[50px] sm:text-[15px]">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }, (_, index) => index + 1).map((age) => (
                <SelectItem key={age} value={String(age)}>
                  {age}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            الحالة الاجتماعية
          </Label>
          <Select value={formData.maritalStatus} onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
            <SelectTrigger className="h-11 w-full rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] sm:h-[50px] sm:text-[15px]">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">أعزب</SelectItem>
              <SelectItem value="married">متزوج</SelectItem>
              <SelectItem value="divorced">مطلق</SelectItem>
              <SelectItem value="widowed">أرمل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
            الحالة الصحية
          </Label>
          <Select value={formData.healthStatus} onValueChange={(value) => setFormData({ ...formData, healthStatus: value })}>
            <SelectTrigger className="h-11 w-full rounded-[10px] border-none bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] sm:h-[50px] sm:text-[15px]">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">جيدة</SelectItem>
              <SelectItem value="average">متوسطة</SelectItem>
              <SelectItem value="needs-care">تحتاج رعاية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="identityNumber" className="block text-right text-[13px] font-bold text-white sm:text-[14px]" style={{ lineHeight: '100%' }}>
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
        className="mx-auto mt-4 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px]"
        style={{ lineHeight: '100%' }}
      >
        التالي
      </Button>
    </form>
  )
}

export default StepTwo
