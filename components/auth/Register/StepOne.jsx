'use client'

import React from 'react'
import { User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRegisterStore } from '@/store/useRegisterStore'

const StepOne = () => {
  const { formData, updateFormData, nextStep, fieldErrors, validateStep, isSubmitting } = useRegisterStore()
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      formData.name.trim() === '' ||
      formData.phone.trim() === '' ||
      formData.email.trim() === ''
    ) {
      toast.error('يرجى تعبئة جميع الحقول')
      return
    }

    const isValid = await validateStep(1)
    if (isValid) {
      nextStep()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[580px] space-y-3 sm:space-y-4"
    >
      <div className="space-y-1.5">
        <Label
          htmlFor="reg-name"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          الاسم كاملاً
        </Label>
        <Input
          id="reg-name"
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="اكتب اسمك كاملاً"
          className={`h-11 rounded-[10px] bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px] ${fieldErrors.name ? 'border-2 border-red-500' : 'border-none'}`}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="reg-phone"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          رقم الجوال
        </Label>
        <div className="relative">
          <Input
            id="reg-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="05XXXXXXXX"
            className={`h-11 rounded-[10px] bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px] ${fieldErrors.phone ? 'border-2 border-red-500' : 'border-none'}`}
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <Phone className="h-5 w-5 text-[#2496FF]" />
          </div>
        </div>
        {fieldErrors.phone && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{fieldErrors.phone}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="reg-email"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          البريد الإلكتروني
        </Label>
        <div className="relative">
          <Input
            id="reg-email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="name@example.com"
            className={`h-11 rounded-[10px] bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px] ${fieldErrors.email ? 'border-2 border-red-500' : 'border-none'}`}
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <i className="bx bx-envelope text-[18px] text-[#2496FF] sm:text-[20px]" />
          </div>
        </div>
        {fieldErrors.email && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{fieldErrors.email}</p>
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

export default StepOne
