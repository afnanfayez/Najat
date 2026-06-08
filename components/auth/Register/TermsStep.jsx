'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useRegisterStore } from '@/store/useRegisterStore'

const TermsStep = () => {
  const [accepted, setAccepted] = useState(false)
  const { submitRegistration, isSubmitting, error, clearErrors, fieldErrors, prevStep } = useRegisterStore()
  const router = useRouter()
  const [isOffline, setIsOffline] = useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine)
      const handleOnline = () => setIsOffline(false)
      const handleOffline = () => setIsOffline(true)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])
  
  React.useEffect(() => {
    clearErrors()
  }, [clearErrors])

  const hasFieldErrors = Object.keys(fieldErrors).length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isOffline) return
    clearErrors()
    if (accepted) {
      // submitRegistration() is the ONLY place in the entire app that calls POST /register.
      // If it fails, the store will automatically redirect the user to the step with errors.
      const success = await submitRegistration()
      if (success) {
        // Redirect to verify page after successful registration
        router.push('/verify')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-full w-full max-w-[650px] flex-col overflow-hidden"
    >
      <div
        className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden text-right text-[15px] font-bold text-black sm:text-[16px] w-full break-words px-2"
        style={{ lineHeight: '1.8' }}
      >
        <p>
          مرحباً بك في موقع "نجاة" - خارطة الحياة في غزة. باستخدامك لهذا الموقع،
          فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي
          جزء من هذه الشروط، يرجى عدم استخدام الموقع.
          <br />
          "نجاة" هو مبادرة إنسانية غير ربحية تهدف إلى تقديم معلومات حيوية لسكان
          غزة في الظروف الصعبة، مع التركيز على العمل دون اتصال بالإنترنت.
        </p>

        <div>
          <h3 className="mb-2 text-[18px] font-extrabold text-black sm:text-[20px]">
            2. الغرض من الموقع
          </h3>
          <ul className="list-inside list-disc space-y-1">
            <li>تقديم معلومات عن المستشفيات والمراكز الصحية العاملة</li>
            <li>توفير بيانات عن نقاط توزيع المساعدات الإنسانية</li>
            <li>عرض خرائط للطرق الآمنة والبديلة</li>
            <li>تقديم إرشادات للإسعافات الأولية والتوعية الصحية</li>
            <li>ربط المتطوعين بفرص المساعدة الميدانية</li>
          </ul>
          <p className="mt-2 text-[14px] text-black/80 sm:text-[15px]">
            جميع المعلومات المقدمة هي لأغراض إنسانية وإرشادية فقط، ولا تغني عن
            الاستشارة الطبية المباشرة.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[18px] font-extrabold text-black sm:text-[20px]">
            3. قبول الشروط
          </h3>
          <p className="mb-1">باستخدامك للموقع، فإنك تقر وتتعهد بما يلي:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>أنك مواطن أو مقيم في غزة أو تقدم مساعدة إنسانية للمنطقة</li>
            <li>أنك توافق على استخدام الموقع للأغراض الإنسانية فقط</li>
            <li>أنك لن تستخدم الموقع لأي أغراض غير قانونية أو ضارة</li>
            <li>أنك تتحمل المسؤولية الكاملة عن أي معلومات تقدمها عبر الموقع</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-[18px] font-extrabold text-black sm:text-[20px]">
            4. التزامات المستخدمين
          </h3>
          <ul className="list-inside list-disc space-y-1">
            <li>عدم مشاركة بيانات الدخول مع أي طرف آخر</li>
            <li>إبلاغ الإدارة فوراً عن أي اختراق أو استخدام غير مصرح به</li>
            <li>تحديث بياناتك الشخصية عند الضرورة</li>
            <li>عدم إنشاء أكثر من حساب واحد</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-[18px] font-extrabold text-black sm:text-[20px]">
            الموافقة على الشروط
          </h3>
          <p>
            باستخدامك لموقع "نجاة"، فإنك تقر بأنك قد قرأت وفهمت ووافقت على
            الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق، يرجى عدم استخدام
            الموقع.
            <br />
            شكراً لكونك جزءاً من مجتمع "نجاة" - معاً نصنع الفرق وننقذ الأرواح 💚
          </p>
        </div>
      </div>

      <div className="mt-2 space-y-2 pt-1">
        <div className="flex items-center justify-start gap-2">
          <Checkbox
            id="acceptTerms"
            checked={accepted}
            onCheckedChange={(c) => setAccepted(Boolean(c))}
            className="h-6 w-6 rounded-[4px] border-black/30 bg-transparent transition-all data-[state=checked]:border-[#2496FF] data-[state=checked]:bg-[#2496FF] data-[state=checked]:text-white"
          />
          <Label
            htmlFor="acceptTerms"
            className="cursor-pointer text-[14px] font-extrabold text-black sm:text-[15px]"
          >
            اوافق على سياسة الشروط والاحكام
          </Label>
        </div>


        {error && !hasFieldErrors && (
          <div className="text-red-500 text-sm font-bold text-center mt-1" dir="rtl">
            {error === 'Failed to fetch' || error.includes('CORS') 
              ? 'خطأ في الاتصال بالخادم (CORS Policy). يرجى إبلاغ مطور الباك إند.'
              : error}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center sm:justify-center sm:gap-3">
          <Button
            type="submit"
            disabled={!accepted || isSubmitting || isOffline}
            className={`flex h-10 w-full items-center justify-center rounded-[10px] text-[16px] font-bold text-white transition-all sm:h-[45px] sm:w-[200px] sm:text-[18px] ${
              isOffline
                ? 'bg-gray-500 cursor-not-allowed hover:bg-gray-500 shadow-none'
                : accepted && !isSubmitting
                  ? 'bg-[#2496FF] shadow-lg shadow-[#2496FF]/10 hover:bg-[#1C7ED6] active:scale-[0.98]'
                  : 'cursor-not-allowed bg-[#D9D9D9] text-[#707070] opacity-80'
            }`}
            style={{ lineHeight: '100%' }}
          >
            {isSubmitting ? 'جاري إنشاء الحساب...' : isOffline ? 'لا يوجد اتصال بالإنترنت' : 'دخول'}
          </Button>

          <Button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="flex h-10 w-full items-center justify-center rounded-[10px] border-2 border-[#2496FF] bg-transparent text-[16px] font-bold text-[#2496FF] transition-all hover:bg-[#2496FF]/5 active:scale-[0.98] sm:h-[45px] sm:w-[120px] sm:text-[18px]"
            style={{ lineHeight: '100%' }}
          >
            رجوع
          </Button>
        </div>
      </div>
    </form>
  )
}

export default TermsStep
