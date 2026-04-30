'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

const SuccessStep = ({ title = 'تم تسجيلك بنجاح' }) => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to dashboard or home
      router.push('/')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-full bg-white/20 p-4 shadow-lg backdrop-blur-sm">
        <CheckCircle2 className="h-24 w-24 text-[#2496FF]" />
      </div>
      <div className="space-y-4">
        <h2 className="text-[26px] font-extrabold text-white sm:text-[32px]" style={{ lineHeight: '100%' }}>
          {title}
        </h2>
        <p className="text-[16px] font-bold text-white/90 sm:text-[18px]">
          مرحباً بك في منصة نجاة. جاري تحويلك إلى لوحة التحكم...
        </p>
      </div>
      
      {/* Loading indicator */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <div className="h-3 w-3 animate-bounce rounded-full bg-[#2496FF]" style={{ animationDelay: '0ms' }}></div>
        <div className="h-3 w-3 animate-bounce rounded-full bg-[#2496FF]" style={{ animationDelay: '150ms' }}></div>
        <div className="h-3 w-3 animate-bounce rounded-full bg-[#2496FF]" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export default SuccessStep
