'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const ResetPassword = ({ onLogin }) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '' || confirmPassword === '' || password !== confirmPassword) {
      setError(true);
      return;
    }
    setError(false);
    if (onLogin) onLogin();
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
        {/* Reset Password Card */}
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
              <h1 className="font-bold text-white tracking-tight text-xl sm:text-[28px]" style={{ lineHeight: '100%' }}>اعادة تعيين كلمة مرور</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-[580px] space-y-6 sm:space-y-8 mt-4 sm:mt-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="new-password" dir="rtl" className="text-white mr-1 block text-right font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>اعادة تعيين كلمة السر</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword1 ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="********"
                    className={`bg-white text-right transition-all placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[14px] sm:text-[15px] px-12 sm:px-14 shadow-[0px_4px_7.6px_0px_#0000001A] ${
                      error ? 'border-2 border-[#F44336]' : 'border-none'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    <i className={`bx bx-key text-[18px] sm:text-[20px] ${error ? 'text-[#F44336]' : 'text-[#2496FF]'}`} />
                  </div>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="text-gray-400 hover:text-[#2496FF] transition-colors"
                    >
                      {showPassword1 ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="confirm-password" dir="rtl" className="text-white mr-1 block text-right font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>تأكيد كلمة السر</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword2 ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="********"
                    className={`bg-white text-right transition-all placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[14px] sm:text-[15px] px-12 sm:px-14 shadow-[0px_4px_7.6px_0px_#0000001A] ${
                      error ? 'border-2 border-[#F44336]' : 'border-none'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    <i className={`bx bx-key text-[18px] sm:text-[20px] ${error ? 'text-[#F44336]' : 'text-[#2496FF]'}`} />
                  </div>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="text-gray-400 hover:text-[#2496FF] transition-colors"
                    >
                      {showPassword2 ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <p 
                    className="text-[#F44336] text-right w-full font-bold text-[13px] sm:text-[14px] mt-1" 
                    style={{ lineHeight: '100%' }}
                  >
                    كلمات المرور غير متطابقة
                  </p>
                )}
              </div>

              <div className="flex items-center justify-start pt-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Checkbox id="remember" className="w-4 h-4 sm:w-5 sm:h-5 border-white/30 bg-white/5 data-[state=checked]:bg-[#2496FF] data-[state=checked]:border-[#2496FF] rounded-md transition-all" />
                  <Label htmlFor="remember" className="text-white cursor-pointer font-semibold text-[12px] sm:text-[14px]" style={{ lineHeight: '100%' }}>تذكرني على هذا الجهاز</Label>
                </div>
              </div>

              <Button type="submit" className="bg-[#2496FF] hover:bg-[#1C7ED6] text-white font-bold flex items-center justify-center shadow-lg shadow-[#2496FF]/10 transition-all active:scale-[0.98] mx-auto mt-6 w-full sm:w-[300px] h-11 sm:h-[50px] rounded-[10px] gap-2 sm:gap-[10px] text-[18px] sm:text-[20px]" style={{ lineHeight: '100%' }}>
                دخول
                <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </form>
            
            {/* Spacer to push content up slightly to match the image balance */}
            <div className="h-4 sm:h-8"></div>
          </div>
        </Card>

        {/* Footer Links */}
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

export default ResetPassword;
