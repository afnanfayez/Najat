'use client'

import React from 'react'
import { User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const StepOne = ({ formData, setFormData, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      formData.name.trim() === '' ||
      formData.phone.trim() === '' ||
      formData.email.trim() === ''
    ) {
      toast.error('يرجى تعبئة جميع الحقول')
      return
    }

    onNext()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[580px] space-y-3 sm:space-y-4"
    >
      <div className="space-y-1">
        <Label
          htmlFor="name"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          الاسم
        </Label>
        <div className="relative">
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="اكتب اسمك هنا"
            className="h-11 rounded-[10px] border-none bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px]"
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <User className="h-5 w-5 text-[#2496FF]" />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="phone"
          className="block text-right text-[13px] font-bold text-white sm:text-[14px]"
          style={{ lineHeight: '100%' }}
        >
          رقم الهاتف
        </Label>
        <div className="relative">
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="0590000000000"
            className="h-11 rounded-[10px] border-none bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px]"
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <Phone className="h-5 w-5 text-[#2496FF]" />
          </div>
        </div>
      </div>

      <div className="space-y-1">
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="name@example.com"
            className="h-11 rounded-[10px] border-none bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px]"
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <i className="bx bx-envelope text-[18px] text-[#2496FF] sm:text-[20px]" />
          </div>
        </div>
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

export default StepOne
