'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import TermsStep from './TermsStep'
import SuccessStep from './SuccessStep'

const AppleAppStoreIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="none"
  >
    <path
      fill="#FFFFFF"
      d="m82.042 185.81l.024.008l-8.753 15.16c-3.195 5.534-10.271 7.43-15.805 4.235s-7.43-10.271-4.235-15.805l6.448-11.168l.619-1.072c1.105-1.588 3.832-4.33 9.287-3.814c0 0 12.837 1.393 13.766 8.065c0 0 .126 2.195-1.351 4.391m124.143-38.72h-27.294c-1.859-.125-2.67-.789-2.99-1.175l-.02-.035l-29.217-50.606l-.038.025l-1.752-2.512c-2.872-4.392-7.432 6.84-7.432 6.84c-5.445 12.516.773 26.745 2.94 31.046l40.582 70.29c3.194 5.533 10.27 7.43 15.805 4.234c5.533-3.195 7.43-10.271 4.234-15.805l-10.147-17.576c-.197-.426-.539-1.582 1.542-1.587h13.787c6.39 0 11.57-5.18 11.57-11.57s-5.18-11.57-11.57-11.57m-53.014 15.728s1.457 7.411-4.18 7.411H48.092c-6.39 0-11.57-5.18-11.57-11.57s5.18-11.57 11.57-11.57h25.94c4.188-.242 5.18-2.66 5.18-2.66l.024.012l33.86-58.648l-.01-.002c.617-1.133.103-2.204.014-2.373l-11.183-19.369c-3.195-5.533-1.299-12.61 4.235-15.804s12.61-1.3 15.805 4.234l5.186 8.983l5.177-8.967c3.195-5.533 10.271-7.43 15.805-4.234s7.43 10.27 4.235 15.804l-47.118 81.61c-.206.497-.269 1.277 1.264 1.414h28.164l.006.275s16.278.253 18.495 15.454"
    />
  </svg>
)

const RegisterForm = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    age: '',
    maritalStatus: '',
    healthStatus: '',
    identityNumber: '',
    housingStatus: '',
    currentMembers: '',
    maleCount: '',
    femaleCount: '',
    region: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  })

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(2)}
          />
        )
      case 2:
        return (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(3)}
          />
        )
      case 3:
        return (
          <StepThree
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(4)}
          />
        )
      case 4:
        return (
          <StepFour
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(5)}
          />
        )
      case 5:
        return <TermsStep onNext={() => setStep(6)} />
      case 6:
        return <SuccessStep />
      default:
        return (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(2)}
          />
        )
    }
  }

  if (step === 6) {
    return <SuccessStep />
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-black px-4 py-8 font-sans sm:px-6 sm:py-12 lg:px-8"
      dir="rtl"
    >
      <div className="fixed inset-0 z-0">
        <Image
          src="/assets/Photo1.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0"></div>
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <Card
          className="scrollbar-hide flex w-full max-w-[750px] flex-col items-center justify-center overflow-hidden rounded-[25px] border-white/[0.1] bg-white/[0.01] px-5 py-4 shadow-2xl backdrop-blur-md sm:px-8 sm:py-6"
          style={{ fontFamily: 'Cairo, sans-serif', height: step === 5 ? 'auto' : '700px', minHeight: step === 5 ? '950px' : '700px' }}
        >
          <div className="flex h-full w-full flex-col items-center justify-between">
            {/* Logo — same as Login */}
            <div className="relative -mt-10 -mb-6 flex h-32 w-32 items-center justify-center sm:-mt-[50px] sm:-mb-[40px] sm:h-[200px] sm:w-[200px]">
              <Image
                src="/assets/Logo1.png"
                alt="Logo"
                width={200}
                height={200}
                className="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(36,150,255,0.1)]"
                priority
              />
            </div>

            {/* Title */}
            {step < 5 ? (
              <div className="mb-2 space-y-1 text-center">
                <h1
                  className="text-xl font-bold tracking-tight text-white sm:text-[24px]"
                  style={{ lineHeight: '100%' }}
                >
                  إنشاء حساب
                </h1>
                <p
                  className="text-base font-bold text-white/80 sm:text-[22px]"
                  style={{ lineHeight: '100%' }}
                >
                  منصة نجاة للخدمات الإنسانية والطوارئ
                </p>
              </div>
            ) : step === 5 ? (
              <div className="mb-2 text-center sm:mb-4">
                <h1
                  className="text-[24px] font-bold text-white sm:text-[30px]"
                  style={{ lineHeight: '100%' }}
                >
                  الشروط والأحكام
                </h1>
              </div>
            ) : null}

            {/* Step Indicator — RTL: 1 on right, 4 on left */}
            {step < 5 && (
              <div className="relative flex w-full max-w-[500px] items-center justify-between mb-3">
                <div className="absolute top-1/2 left-0 z-0 h-[2px] w-full -translate-y-1/2 bg-white/20"></div>
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="relative z-10">
                    <div
                      onClick={() => s < step && setStep(s)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[16px] font-bold transition-all duration-300 sm:h-10 sm:w-10 sm:text-[20px] ${step === s
                        ? 'scale-110 bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                        : s < step
                          ? 'cursor-pointer bg-white/70 text-black hover:bg-white hover:scale-105'
                          : 'cursor-default bg-[#D9D9D9] text-[#707070]'
                        }`}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step Content */}
            <div className="w-full mb-2">{renderStep()}</div>

            {/* Bottom Links */}
            <div className={`flex flex-col items-center gap-0 pt-0 transition-opacity duration-300 ${step === 1 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <div className="text-center">
                <span
                  className="text-[13px] font-bold text-white sm:text-[14px]"
                  style={{ lineHeight: '100%' }}
                >
                  هل تمتلك فعلاً حساب؟{' '}
                </span>
                <Link
                  href="/login"
                  className="text-[13px] font-bold transition-opacity hover:opacity-80 sm:text-[14px]"
                  style={{ color: '#FDB022', lineHeight: '100%' }}
                >
                  تسجيل الدخول
                </Link>
              </div>

              <div className="mx-auto flex w-full max-w-[580px] items-center gap-3 py-1 sm:gap-4">
                <Separator className="flex-1 bg-white" />
                <span
                  className="shrink-0 text-[10px] font-bold text-white sm:text-[11px]"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '100%',
                  }}
                >
                  المتابعة باستخدام
                </span>
                <Separator className="flex-1 bg-white" />
              </div>

              <div className="flex items-center justify-center gap-4 pb-0 sm:gap-6">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-[50px] sm:w-[50px]"
                >
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                    alt="Google"
                    width={28}
                    height={28}
                    className="sm:h-8 sm:w-8"
                    unoptimized
                  />
                </button>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-[50px] sm:w-[50px]"
                >
                  <AppleAppStoreIcon size={28} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 flex w-full flex-col items-center space-y-2 px-4 text-white sm:mt-8">
          <div
            className="flex flex-wrap items-center justify-center gap-3 text-[13px] font-semibold sm:gap-4 sm:text-[14px]"
            style={{ lineHeight: '100%' }}
          >
            <Link href="#" className="transition-colors hover:text-white">
              سياسة الخصوصية
            </Link>
            <div className="hidden h-1 w-1 rounded-full bg-white sm:block"></div>
            <Link href="#" className="transition-colors hover:text-white">
              اتصل بنا
            </Link>
            <div className="hidden h-1 w-1 rounded-full bg-white sm:block"></div>
            <Link href="#" className="transition-colors hover:text-white">
              English Version
            </Link>
          </div>
          <p
            className="text-center text-[11px] font-semibold text-white/60 sm:text-[12px]"
            style={{ lineHeight: '100%' }}
          >
            © 2024 نظام نجاة للمواطنين. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
