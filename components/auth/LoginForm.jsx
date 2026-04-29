'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black font-sans" dir="rtl">
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

      {/* Login Card */}
      <Card 
        className="relative z-10 bg-white/[0.02] backdrop-blur-md border-white/[0.05] p-8 shadow-2xl rounded-[15px] flex flex-col items-center overflow-hidden -mt-12"
        style={{
          width: '750px',
          height: 'min(680px, 90vh)',
        }}
      >
        <div className="w-full flex flex-col items-center">
          {/* Logo - Moved up */}
          <div 
            className="relative flex items-center justify-center"
            style={{
                width: '260px',
                height: '260px',
                marginTop: '-100px', 
            }}
          >
            <Image
                src="/assets/Logo1.png"
                alt="Logo"
                width={260}
                height={260}
                className="object-contain"
                priority
            />
          </div>

          <div className="text-center space-y-0 -mt-12 mb-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">تسجيل الدخول</h1>
            <p className="text-white text-xl">منصة نجاة للخدمات الإنسانية والطوارئ</p>
          </div>

          {/* Form */}
          <form className="w-full max-w-[550px] space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white text-base mr-1 block text-right">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-14 bg-white rounded-2xl text-right pr-6 pl-12 text-black placeholder:text-gray-400 focus-visible:ring-blue-500 border-none text-lg"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <Mail className="w-6 h-6 text-[#2496FF]" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" dir="rtl" className="text-white text-base mr-1 block text-right">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="h-14 bg-white rounded-2xl text-right pr-6 pl-12 text-black placeholder:text-gray-400 focus-visible:ring-blue-500 border-none text-lg"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-3 space-x-reverse">
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                    <Lock className="w-6 h-6 text-[#2496FF]" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <Link href="#" className="text-[#FDB022] hover:underline font-bold text-base">
                    نسيت كلمة المرور؟
                </Link>
                <div className="flex items-center gap-3">
                    <Label htmlFor="remember" className="text-white cursor-pointer text-base">تذكرني على هذا الجهاز</Label>
                    <Checkbox id="remember" className="w-5 h-5 border-white/50 bg-transparent data-[state=checked]:bg-[#2496FF] data-[state=checked]:border-[#2496FF] rounded-md" />
                </div>
            </div>

            <Button className="w-full h-11 bg-[#2496FF] hover:bg-[#1C7ED6] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 mt-3">
               <LogIn className="w-6 h-6" />
               دخول
            </Button>
          </form>

          <div className="text-center pt-0">
            <span className="text-white text-sm">ليس لديك حساب؟ </span>
            <Link href="#" className="text-[#FDB022] hover:underline font-bold text-sm">إنشاء حساب جديد</Link>
          </div>

          <div className="w-full flex items-center gap-4 py-0">
            <Separator className="flex-1 bg-white/10" />
            <span className="text-white/50 text-xs shrink-0">المتابعة باستخدام</span>
            <Separator className="flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center gap-6 mt-1">
            <button className="w-8 h-8 flex items-center justify-center bg-transparent transition-transform hover:scale-110">
                <Image src="https://www.svgrepo.com/show/303108/apple-black-logo.svg" alt="Apple" width={24} height={24} className="invert" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-transparent transition-transform hover:scale-110">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={24} height={24} />
            </button>
          </div>
        </div>
      </Card>

      {/* Footer Links */}
      <div className="absolute bottom-6 w-full flex flex-col items-center space-y-2 text-white/60 text-xs">
         <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">English Version</Link>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <Link href="#" className="hover:text-white transition-colors">اتصل بنا</Link>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
         </div>
         <p>© 2024 نظام نجاة للطوارئ. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  );
};

export default LoginForm;
