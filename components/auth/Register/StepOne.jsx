'use client'

import React, { useEffect } from 'react'
import { Phone } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegisterStore } from '@/store/useRegisterStore'
import { registerStepOneSchema } from '@/schemas/registerStepOne'

const StepOne = () => {
  const { formData, updateFormData, nextStep, fieldErrors } = useRegisterStore()

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerStepOneSchema),
    defaultValues: {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    },
    mode: 'onSubmit',
  })

  useEffect(() => {
    reset({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    })
  }, [formData.name, formData.phone, formData.email, reset])

  // Merge Zod client errors with any backend field errors carried over
  const getError = (field) => {
    if (errors[field]) return errors[field].message
    if (fieldErrors[field]) return fieldErrors[field]
    return null
  }

  const onValid = (values) => {
    updateFormData({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    })
    nextStep()
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
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
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="reg-name"
              type="text"
              onChange={(e) => {
                field.onChange(e)
                if (errors.name) clearErrors('name')
              }}
              placeholder="اكتب اسمك كاملاً"
              className={`h-11 rounded-[10px] bg-white/95 px-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:text-[15px] ${getError('name') ? 'border-2 border-red-500' : 'border-none'}`}
            />
          )}
        />
        {getError('name') && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('name')}</p>
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
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="reg-phone"
                type="tel"
                onChange={(e) => {
                  field.onChange(e)
                  if (errors.phone) clearErrors('phone')
                }}
                placeholder="05XXXXXXXX"
                className={`h-11 rounded-[10px] bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px] ${getError('phone') ? 'border-2 border-red-500' : 'border-none'}`}
              />
            )}
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <Phone className="h-5 w-5 text-[#2496FF]" />
          </div>
        </div>
        {getError('phone') && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('phone')}</p>
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
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="reg-email"
                type="text"
                inputMode="email"
                autoComplete="email"
                onChange={(e) => {
                  field.onChange(e)
                  if (errors.email) clearErrors('email')
                }}
                placeholder="name@example.com"
                className={`h-11 rounded-[10px] bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px] ${getError('email') ? 'border-2 border-red-500' : 'border-none'}`}
              />
            )}
          />
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <i className="bx bx-envelope text-[18px] text-[#2496FF] sm:text-[20px]" />
          </div>
        </div>
        {getError('email') && (
          <p className="mt-1 text-right text-[12px] font-bold text-red-500">{getError('email')}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mx-auto mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px]"
        style={{ lineHeight: '100%' }}
      >
        التالي
      </Button>
    </form>
  )
}

export default StepOne
