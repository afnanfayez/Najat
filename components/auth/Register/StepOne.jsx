'use client';

import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const StepOne = ({ formData, setFormData, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[580px] mx-auto space-y-3 sm:space-y-4">

      <div className="space-y-1">
        <Label htmlFor="name" className="text-white block text-right font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>الاسم</Label>
        <div className="relative">
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="اكتب اسمك هنا"
            className="bg-white/95 text-right border-none placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[14px] sm:text-[15px] pl-4 pr-12 sm:pr-14 shadow-[0px_4px_7.6px_0px_#0000001A]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <User className="text-[#2496FF] w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone" className="text-white block text-right font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>رقم الهاتف</Label>
        <div className="relative">
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0590000000000"
            className="bg-white/95 text-right border-none placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[14px] sm:text-[15px] pl-4 pr-12 sm:pr-14 shadow-[0px_4px_7.6px_0px_#0000001A]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Phone className="text-[#2496FF] w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="reg-email" className="text-white block text-right font-bold text-[13px] sm:text-[14px]" style={{ lineHeight: '100%' }}>البريد الإلكتروني</Label>
        <div className="relative">
          <Input
            id="reg-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.com"
            className="bg-white/95 text-right border-none placeholder:text-gray-400 text-black h-11 sm:h-[50px] rounded-[10px] text-[14px] sm:text-[15px] pl-4 pr-12 sm:pr-14 shadow-[0px_4px_7.6px_0px_#0000001A]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <i className="bx bx-envelope text-[#2496FF] text-[18px] sm:text-[20px]" />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="bg-[#2496FF] hover:bg-[#1C7ED6] text-white font-bold flex items-center justify-center shadow-lg shadow-[#2496FF]/10 transition-all active:scale-[0.98] mx-auto mt-2 w-full sm:w-[350px] h-11 sm:h-[50px] rounded-[10px] text-[18px] sm:text-[20px]"
        style={{ lineHeight: '100%' }}
      >
        التالي
      </Button>
    </form>
  );
};

export default StepOne;
