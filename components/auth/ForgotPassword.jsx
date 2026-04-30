'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const ForgotPassword = ({ onBack, onSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(email);
  };

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
        {/* Forgot Password Card */}
        <Card
          className="bg-white/[0.01] backdrop-blur-md border-white/[0.1] px-5 sm:px-8 py-6 sm:py-8 shadow-2xl rounded-[25px] flex flex-col items-center justify-center w-full max-w-[750px] overflow-y-auto scrollbar-hide"
          style={{
            fontFamily: 'Cairo, sans-serif',
            height: '700px'
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-between">
            {/* Logo Container */}
            <div className="relative flex items-center justify-center w-32 h-32 sm:w-[200px] sm:h-[200px] -mt-10 sm:-mt-[50px] -mb-6 sm:-mb-[40px]">
              <Image
                src="/assets/Logo1.png"
                alt="Logo"
                width={200}
                height={200}
                className="object-contain drop-shadow-[0_0_15px_rgba(36,150,255,0.1)] w-full h-full"
                priority
              />
            </div>

            <div className="text-center w-full">
              <h1 className="font-bold text-white tracking-tight text-xl sm:text-[28px]" style={{ lineHeight: '100%' }}>نسيت كلمة المرور</h1>
              <p className="text-white/90 font-bold text-base sm:text-[18px] max-w-[450px] mx-auto mt-8 sm:mt-12" style={{ lineHeight: '140%' }}>
                ارسل لنا البريد الالكتروني لنرسل لك الرمز الخاص لاسترداد حسابك
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-[580px] space-y-8 sm:space-y-10">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="email" className="text-white mr-1 block text-right font-bold text-[14px] sm:text-[15px]" style={{ lineHeight: '100%' }}>البريد الإلكتروني</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-white text-right border-none transition-all placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[15px] sm:text-[16px] pl-4 pr-12 sm:pr-14 shadow-[0px_4px_7.6px_0px_#0000001A]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <Mail className="text-[#2496FF] w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>

              <Button type="submit" className="bg-[#2496FF] hover:bg-[#1C7ED6] text-white font-bold flex items-center justify-center shadow-lg shadow-[#2496FF]/10 transition-all active:scale-[0.98] mx-auto w-full sm:w-[350px] h-11 sm:h-[50px] rounded-[10px] text-[18px] sm:text-[20px]" style={{ lineHeight: '100%' }}>
                ارسال
              </Button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-2">
              <div className="text-center">
                <span className="text-white font-bold text-[14px] sm:text-[15px]" style={{ lineHeight: '100%' }}>ليس لديك حساب؟ </span>
                <Link href="#" className="hover:opacity-80 transition-opacity font-bold text-[14px] sm:text-[15px]" style={{ color: '#FDB022', lineHeight: '100%' }}>إنشاء حساب جديد</Link>
              </div>

              {/* Back to Login Link */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[14px] font-bold pb-2"
              >
                <ArrowRight className="w-4 h-4" />
                العودة لتسجيل الدخول
              </button>
            </div>
          </div>
        </Card>

        {/* Footer Links (Placed directly under the card) */}
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

export default ForgotPassword;
