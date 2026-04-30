'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const EnterCode = ({ onBack, onSubmit }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (inputs.current[0]) inputs.current[0].focus();
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      if (fullCode === '000000') {
        setError(true);
      } else {
        setError(false);
        if (onSubmit) onSubmit(fullCode);
      }
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value) || value === ' ') return;
    if (error) setError(false);

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputs.current[index + 1].focus();
    } else if (value !== '' && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        if (fullCode === '000000') {
          setError(true);
        } else {
          setError(false);
          if (onSubmit) onSubmit(fullCode);
        }
      }
    }
  };

  const handleResend = () => {
    setCode(['', '', '', '', '', '']);
    setError(false);
    if (inputs.current[0]) inputs.current[0].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (pastedData.length === 0) return;
    if (error) setError(false);

    const newCode = [...code];
    pastedData.forEach((char, i) => { newCode[i] = char; });
    setCode(newCode);
    
    const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputs.current[focusIndex].focus();
    
    if (pastedData.length === 6) {
      const fullCode = pastedData.join('');
      if (fullCode === '000000') {
        setError(true);
      } else {
        setError(false);
        if (onSubmit) onSubmit(fullCode);
      }
    }
  };

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
          <div className="w-full h-full flex flex-col items-center justify-between">
            <div className="relative flex items-center justify-center w-32 h-32 sm:w-[200px] sm:h-[200px] -mt-10 sm:-mt-[50px] -mb-6 sm:-mb-[40px]">
              <Image src="/assets/Logo1.png" alt="Logo" width={200} height={200} className="object-contain drop-shadow-[0_0_15px_rgba(36,150,255,0.1)] w-full h-full" priority />
            </div>

            <div className="text-center w-full">
              <h1 className="font-bold text-white tracking-tight text-xl sm:text-[28px]" style={{ lineHeight: '100%' }}>ادخال الكود</h1>
              <p className="text-white/90 font-bold text-base sm:text-[18px] max-w-[450px] mx-auto mt-8 sm:mt-12" style={{ lineHeight: '140%' }}>
                قم بإدخال الكود الذي قمنا بارساله
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-[580px] space-y-8 sm:space-y-10 mt-4 sm:mt-6">
              <div className="w-full flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-2 sm:gap-4 w-full" dir="ltr">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-[24px] sm:text-[28px] font-bold bg-white/90 rounded-[12px] sm:rounded-[15px] focus:ring-2 focus:ring-[#2496FF] focus:outline-none transition-all shadow-[0px_4px_7.6px_0px_#0000001A] ${
                        error ? 'border-2 border-[#F44336] text-[#F44336]' : 'border-none text-black'
                      }`}
                    />
                  ))}
                </div>
                <div className="w-full max-w-[340px] sm:max-w-[440px] mt-1">
                  <button type="button" onClick={handleResend} className="text-white font-bold text-[13px] sm:text-[15px] hover:opacity-80 transition-opacity float-left">اعد ارسال الكود؟</button>
                  <div className="clear-both"></div>
                </div>
              </div>
              <Button type="submit" className="bg-[#2496FF] hover:bg-[#1C7ED6] text-white font-bold flex items-center justify-center shadow-lg shadow-[#2496FF]/10 transition-all active:scale-[0.98] mx-auto w-full sm:w-[350px] h-11 sm:h-[50px] rounded-[10px] text-[18px] sm:text-[20px]" style={{ lineHeight: '100%' }}>ارسال</Button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-2">
              <div className="text-center">
                <span className="text-white font-bold text-[14px] sm:text-[15px]" style={{ lineHeight: '100%' }}>ليس لديك حساب؟ </span>
                <Link href="#" className="hover:opacity-80 transition-opacity font-bold text-[14px] sm:text-[15px]" style={{ color: '#FDB022', lineHeight: '100%' }}>إنشاء حساب جديد</Link>
              </div>
              <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[14px] font-bold pb-2">
                <ArrowRight className="w-4 h-4" /> العودة
              </button>
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

export default EnterCode;
