'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useRegisterStore } from '@/store/useRegisterStore'

const TermsStep = () => {
  const [accepted, setAccepted] = useState(false)
  const { nextStep } = useRegisterStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (accepted) {
      nextStep()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-full w-full max-w-[650px] flex-col"
    >
      <div
        className="flex-1 space-y-6 pr-2 text-right text-[15px] font-bold text-black sm:text-[16px]"
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

      <div className="mt-4 space-y-3 pt-2">
        <div className="flex items-center justify-start gap-2">
          <Checkbox
            id="acceptTerms"
            checked={accepted}
            onCheckedChange={(c) => setAccepted(Boolean(c))}
            className="h-6 w-6 rounded-[4px] border-black/30 bg-transparent transition-all data-[state=checked]:border-[#2496FF] data-[state=checked]:bg-[#2496FF] data-[state=checked]:text-white"
          />
          <Label
            htmlFor="acceptTerms"
            className="cursor-pointer text-[15px] font-extrabold text-black sm:text-[16px]"
          >
            اوافق على سياسة الشروط والاحكام
          </Label>
        </div>

        <Button
          type="submit"
          disabled={!accepted}
          className={`mx-auto flex h-11 w-full items-center justify-center rounded-[10px] text-[18px] font-bold text-white transition-all sm:h-[50px] sm:w-[350px] sm:text-[20px] ${
            accepted
              ? 'bg-[#2496FF] shadow-lg shadow-[#2496FF]/10 hover:bg-[#1C7ED6] active:scale-[0.98]'
              : 'cursor-not-allowed bg-[#D9D9D9] text-[#707070] opacity-80'
          }`}
          style={{ lineHeight: '100%' }}
        >
          دخول
        </Button>
      </div>
    </form>
  )
}

export default TermsStep
