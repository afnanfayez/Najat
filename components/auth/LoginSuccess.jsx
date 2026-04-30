'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

const AppleAppStoreIcon = ({
  size = 40,
  opacity = 1,
  className = ""
}) => {
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
      <path fill="#FFFFFF" d="m82.042 185.81l.024.008l-8.753 15.16c-3.195 5.534-10.271 7.43-15.805 4.235s-7.43-10.271-4.235-15.805l6.448-11.168l.619-1.072c1.105-1.588 3.832-4.33 9.287-3.814c0 0 12.837 1.393 13.766 8.065c0 0 .126 2.195-1.351 4.391m124.143-38.72h-27.294c-1.859-.125-2.67-.789-2.99-1.175l-.02-.035l-29.217-50.606l-.038.025l-1.752-2.512c-2.872-4.392-7.432 6.84-7.432 6.84c-5.445 12.516.773 26.745 2.94 31.046l40.582 70.29c3.194 5.533 10.27 7.43 15.805 4.234c5.533-3.195 7.43-10.271 4.234-15.805l-10.147-17.576c-.197-.426-.539-1.582 1.542-1.587h13.787c6.39 0 11.57-5.18 11.57-11.57s-5.18-11.57-11.57-11.57m-53.014 15.728s1.457 7.411-4.18 7.411H48.092c-6.39 0-11.57-5.18-11.57-11.57s5.18-11.57 11.57-11.57h25.94c4.188-.242 5.18-2.66 5.18-2.66l.024.012l33.86-58.648l-.01-.002c.617-1.133.103-2.204.014-2.373l-11.183-19.369c-3.195-5.533-1.299-12.61 4.235-15.804s12.61-1.3 15.805 4.234l5.186 8.983l5.177-8.967c3.195-5.533 10.271-7.43 15.805-4.234s7.43 10.27 4.235 15.804l-47.118 81.61c-.206.497-.269 1.277 1.264 1.414h28.164l.006.275s16.278.253 18.495 15.454" />
    </svg>
  );
};

const LoginSuccess = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black font-sans px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Photo1.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center h-full">
        {/* Login Card */}
        <Card
          className="bg-white/[0.01] backdrop-blur-md border-white/[0.1] px-5 sm:px-8 py-6 sm:py-8 shadow-2xl rounded-[25px] flex flex-col items-center justify-center w-full max-w-[750px] overflow-hidden"
          style={{
            fontFamily: 'Cairo, sans-serif',
            height: '700px'
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-between">
            {/* Logo Container */}
            <div
              className="relative flex items-center justify-center w-32 h-32 sm:w-[200px] sm:h-[200px] -mt-10 sm:-mt-[50px] -mb-6 sm:-mb-[40px]"
            >
              <Image
                src="/assets/Logo1.png"
                alt="Logo"
                width={200}
                height={200}
                className="object-contain drop-shadow-[0_0_15px_rgba(36,150,255,0.1)] w-full h-full"
                priority
              />
            </div>

            <div className="text-center space-y-2 sm:space-y-3 mb-4 sm:mb-3">
              <h1 className="font-bold text-white tracking-tight text-xl sm:text-[24px]" style={{ lineHeight: '100%' }}>تسجيل الدخول</h1>
              <p className="text-white/80 font-bold text-base sm:text-[22px]" style={{ lineHeight: '100%' }}>منصة نجاة للخدمات الإنسانية والطوارئ</p>
            </div>

            {/* Form */}
            <form className="w-full max-w-[580px] space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-white mr-1 block text-right font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>البريد الإلكتروني</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="bg-white/95 text-right border-2 border-[#459F49] transition-all placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[14px] sm:text-[15px] pl-4 pr-12 sm:pr-14 shadow-[0px_4px_7.6px_0px_#0000001A]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <i className="bx bx-envelope text-[#459F49] text-[18px] sm:text-[20px]" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" dir="rtl" className="text-white mr-1 block text-right font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="bg-white/95 text-right border-2 border-[#459F49] transition-all placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[14px] sm:text-[15px] px-12 sm:px-14 shadow-[0px_4px_7.6px_0px_#0000001A]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    <i className="bx bx-key text-[#459F49] text-[18px] sm:text-[20px]" />
                  </div>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#459F49] hover:opacity-80 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Checkbox id="remember" className="w-4 h-4 sm:w-5 sm:h-5 border-white/30 bg-white/5 data-[state=checked]:bg-[#459F49] data-[state=checked]:border-[#459F49] rounded-md transition-all" />
                  <Label htmlFor="remember" className="text-white cursor-pointer font-semibold text-[12px] sm:text-[14px]" style={{ lineHeight: '100%' }}>تذكرني على هذا الجهاز</Label>
                </div>
                <Link href="#" className="hover:opacity-80 transition-opacity font-bold text-[12px] sm:text-[14px]" style={{ color: '#E8B006', lineHeight: '100%' }}>
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <Button className="bg-[#459F49] hover:bg-[#3A8A3D] text-white font-bold flex items-center justify-center shadow-lg shadow-[#459F49]/20 transition-all active:scale-[0.98] mx-auto mt-3 w-full sm:w-[300px] h-11 sm:h-[50px] rounded-[10px]" style={{ lineHeight: '100%' }}>
                <CheckCircle2 
                  className="text-white" 
                  style={{ 
                    width: '30px', 
                    height: '30px'
                  }} 
                  strokeWidth={3} 
                />
              </Button>
            </form>

            <div className="text-center pt-3 sm:pt-2">
              <span className="text-white font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>ليس لديك حساب؟ </span>
              <Link href="#" className="hover:opacity-80 transition-opacity font-bold text-[13px] sm:text-[14px]" style={{ color: '#FDB022', lineHeight: '100%' }}>إنشاء حساب جديد</Link>
            </div>

            <div className="w-full max-w-[300px] flex items-center gap-3 sm:gap-4 py-2 mx-auto">
              <Separator className="flex-1 bg-white" />
              <span className="text-white shrink-0 font-bold text-[10px] sm:text-[11px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '100%' }}>المتابعة باستخدام</span>
              <Separator className="flex-1 bg-white" />
            </div>

            <div className="flex justify-center gap-12 sm:gap-20 pt-3 sm:pt-5">
              <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 opacity-90 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group">
                <AppleAppStoreIcon size={40} className="w-8 h-8 sm:w-10 sm:h-10 opacity-90 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </Card>

        {/* Footer Links (Placed directly under the card) */}
        <div className="w-full flex flex-col items-center space-y-2 text-white mt-6 sm:mt-8 px-4">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 font-semibold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>
            <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white"></div>
            <Link href="#" className="hover:text-white transition-colors">اتصل بنا</Link>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white"></div>
            <Link href="#" className="hover:text-white transition-colors">English Version</Link>
          </div>
          <p className="font-semibold text-white/60 text-[11px] sm:text-[12px] text-center" style={{ lineHeight: '100%' }}>© 2024 نظام نجاة للمواطنين. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
