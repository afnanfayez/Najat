'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

const LoginSuccess = () => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black font-sans px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/Photo1.png" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center h-full">
        <Card
          className="bg-white/[0.01] backdrop-blur-md border-white/[0.1] px-5 sm:px-8 py-6 sm:py-8 shadow-2xl rounded-[25px] flex flex-col items-center justify-center w-full max-w-[750px] overflow-y-auto scrollbar-hide"
          style={{ fontFamily: 'Cairo, sans-serif', height: '700px' }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-32 h-32 sm:w-[200px] sm:h-[200px] -mt-10 sm:-mt-[50px] mb-8 sm:mb-12">
              <Image src="/assets/Logo1.png" alt="Logo" width={200} height={200} className="object-contain drop-shadow-[0_0_15px_rgba(36,150,255,0.1)] w-full h-full" priority />
            </div>

            <div className="flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 bg-[#2496FF] rounded-full shadow-[0_0_30px_rgba(36,150,255,0.4)] mb-8 sm:mb-10 animate-in zoom-in duration-500">
              <Check className="w-10 h-10 sm:w-14 sm:h-14 text-white stroke-[3]" />
            </div>

            <div className="text-center space-y-4 sm:space-y-6">
              <h1 className="font-bold text-white tracking-tight text-2xl sm:text-[32px]" style={{ lineHeight: '100%' }}>تم تسجيل الدخول بنجاح</h1>
              <p className="text-white/80 font-bold text-base sm:text-[20px] max-w-[400px] mx-auto" style={{ lineHeight: '140%' }}>مرحباً بك في منصة نجاة. جاري تحويلك إلى لوحة التحكم...</p>
            </div>
          </div>
        </Card>

        <div className="w-full flex flex-col items-center space-y-2 text-white mt-8 sm:mt-8 px-4">
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
