'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, KeyRound, Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'

import { useLoginStore } from '@/store/useLoginStore'
import { useRegisterStore } from '@/store/useRegisterStore'

const AppleAppStoreIcon = ({ size = 40, opacity = 1, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={{ opacity }}
    >
      <path
        fill="#FFFFFF"
        d="m82.042 185.81l.024.008l-8.753 15.16c-3.195 5.534-10.271 7.43-15.805 4.235s-7.43-10.271-4.235-15.805l6.448-11.168l.619-1.072c1.105-1.588 3.832-4.33 9.287-3.814c0 0 12.837 1.393 13.766 8.065c0 0 .126 2.195-1.351 4.391m124.143-38.72h-27.294c-1.859-.125-2.67-.789-2.99-1.175l-.02-.035l-29.217-50.606l-.038.025l-1.752-2.512c-2.872-4.392-7.432 6.84-7.432 6.84c-5.445 12.516.773 26.745 2.94 31.046l40.582 70.29c3.194 5.533 10.27 7.43 15.805 4.234c5.533-3.195 7.43-10.271 4.234-15.805l-10.147-17.576c-.197-.426-.539-1.582 1.542-1.587h13.787c6.39 0 11.57-5.18 11.57-11.57s-5.18-11.57-11.57-11.57m-53.014 15.728s1.457 7.411-4.18 7.411H48.092c-6.39 0-11.57-5.18-11.57-11.57s5.18-11.57 11.57-11.57h25.94c4.188-.242 5.18-2.66 5.18-2.66l.024.012l33.86-58.648l-.01-.002c.617-1.133.103-2.204.014-2.373l-11.183-19.369c-3.195-5.533-1.299-12.61 4.235-15.804s12.61-1.3 15.805 4.234l5.186 8.983l5.177-8.967c3.195-5.533 10.271-7.43 15.805-4.234s7.43 10.27 4.235 15.804l-47.118 81.61c-.206.497-.269 1.277 1.264 1.414h28.164l.006.275s16.278.253 18.495 15.454"
      />
    </svg>
  )
}

const LoginError = () => {
  const {
    email,
    password,
    showPassword,
    emailError,
    passwordError,
    isValid,
    setEmail,
    setPassword,
    setShowPassword,
    handleLoginSuccess,
    handleLoginFailure,
    handleForgotClick,
  } = useLoginStore()
  const { resetRegister } = useRegisterStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid) {
      handleLoginSuccess()
    } else {
      const isEmailValid = email.includes('@')
      const isPasswordValid = password.length >= 8
      handleLoginFailure(!isEmailValid, !isPasswordValid)
    }
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4 font-sans sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Photo1.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0"></div>
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <Card
          className="scrollbar-hide flex w-full max-w-[750px] flex-col items-center justify-center overflow-y-auto rounded-[25px] border-white/[0.1] bg-white/[0.01] px-5 py-6 shadow-2xl backdrop-blur-md sm:px-8 sm:py-8"
          style={{
            fontFamily: 'Cairo, sans-serif',
            height: '700px',
          }}
        >
          <div className="flex h-full w-full flex-col items-center justify-between">
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

            <div className="mb-4 space-y-2 text-center sm:mb-3 sm:space-y-3">
              <h1
                className="text-xl font-bold tracking-tight text-white sm:text-[24px]"
                style={{ lineHeight: '100%' }}
              >
                تسجيل الدخول
              </h1>
              <p
                className="text-base font-bold text-white/80 sm:text-[22px]"
                style={{ lineHeight: '100%' }}
              >
                منصة نجاة للخدمات الإنسانية والطوارئ
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full max-w-[580px] space-y-4 sm:space-y-5"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="mr-1 block text-right text-[13px] font-bold text-white sm:text-[14px]"
                  style={{ lineHeight: '100%' }}
                >
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`h-11 rounded-[10px] bg-white/95 pr-12 pl-4 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] transition-all placeholder:text-gray-400 sm:h-[50px] sm:pr-14 sm:text-[15px] ${
                      emailError ? 'border-2 border-[#F44336]' : 'border-none'
                    }`}
                  />
                  <div className="pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
                    <i
                      className={`bx bx-envelope text-[18px] sm:text-[20px] ${
                        emailError ? 'text-[#F44336]' : 'text-[#2496FF]'
                      }`}
                    />
                  </div>
                </div>

                {emailError && (
                  <p
                    className="w-full text-left text-[15px] font-bold text-[#F44336]"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      lineHeight: '100%',
                    }}
                  >
                    اسم مستخدم غير صحيح
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="password"
                  dir="rtl"
                  className="mr-1 block text-right text-[13px] font-bold text-white sm:text-[14px]"
                  style={{ lineHeight: '100%' }}
                >
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className={`h-11 rounded-[10px] bg-white/95 px-12 text-right text-[14px] text-black shadow-[0px_4px_7.6px_0px_#0000001A] transition-all placeholder:text-gray-400 sm:h-[50px] sm:px-14 sm:text-[15px] ${
                      passwordError
                        ? 'border-2 border-[#F44336]'
                        : 'border-none'
                    }`}
                  />
                  <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
                    <i
                      className={`bx bx-key text-[18px] sm:text-[20px] ${
                        passwordError ? 'text-[#F44336]' : 'text-[#2496FF]'
                      }`}
                    />
                  </div>
                  <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 transition-colors hover:text-[#2496FF]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <p
                    className="w-full text-left text-[15px] font-bold text-[#F44336]"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      lineHeight: '100%',
                    }}
                  >
                    كلمة مرور غير صحيحة
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Checkbox
                    id="remember"
                    className="h-4 w-4 rounded-md border-white/30 bg-white/5 transition-all data-[state=checked]:border-[#2496FF] data-[state=checked]:bg-[#2496FF] sm:h-5 sm:w-5"
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-[12px] font-semibold text-white sm:text-[14px]"
                    style={{ lineHeight: '100%' }}
                  >
                    تذكرني على هذا الجهاز
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotClick}
                  className="text-[12px] font-bold transition-opacity hover:opacity-80 sm:text-[14px]"
                  style={{ color: '#E8B006', lineHeight: '100%' }}
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              <Button
                type="submit"
                className="mx-auto mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#2496FF] text-[18px] font-bold text-white shadow-lg shadow-[#2496FF]/10 transition-all hover:bg-[#1C7ED6] active:scale-[0.98] sm:h-[50px] sm:w-[300px] sm:gap-[10px] sm:text-[20px]"
                style={{ lineHeight: '100%' }}
              >
                دخول
                <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </form>

            <div className="pt-3 text-center sm:pt-2">
              <span
                className="text-[13px] font-bold text-white sm:text-[14px]"
                style={{ lineHeight: '100%' }}
              >
                ليس لديك حساب؟{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  resetRegister()
                  window.location.href = '/register'
                }}
                className="text-[13px] font-bold transition-opacity hover:opacity-80 sm:text-[14px]"
                style={{ color: '#FDB022', lineHeight: '100%' }}
              >
                إنشاء حساب جديد
              </button>
            </div>

            <div className="mx-auto flex w-full max-w-[300px] items-center gap-3 py-2 sm:gap-4">
              <Separator className="flex-1 bg-white" />
              <span
                className="shrink-0 text-[10px] font-bold text-white sm:text-[11px]"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: '100%' }}
              >
                المتابعة باستخدام
              </span>
              <Separator className="flex-1 bg-white" />
            </div>

            <div className="flex justify-center gap-12 pt-3 sm:gap-20 sm:pt-5">
              <button className="group flex h-10 w-10 items-center justify-center transition-all hover:scale-110 active:scale-95 sm:h-12 sm:w-12">
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={40}
                  height={40}
                  className="h-8 w-8 opacity-90 transition-opacity group-hover:opacity-100 sm:h-10 sm:w-10"
                />
              </button>
              <button className="group flex h-10 w-10 items-center justify-center transition-all hover:scale-110 active:scale-95 sm:h-12 sm:w-12">
                <AppleAppStoreIcon
                  size={40}
                  className="h-8 w-8 opacity-90 transition-opacity group-hover:opacity-100 sm:h-10 sm:w-10"
                />
              </button>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex w-full flex-col items-center space-y-2 px-4 text-white sm:mt-8">
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

export default LoginError
