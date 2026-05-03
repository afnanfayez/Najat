'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRegisterStore } from '@/store/useRegisterStore'

const VerifyStep = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const inputs = useRef([])
  const { verifyAccount, isSubmitting } = useRegisterStore()

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus()
    }
  }, [])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length === 6) {
      const success = await verifyAccount(fullCode)
      if (!success) {
        setError(true)
      }
    }
  }

  const handleChange = (e, index) => {
    const value = e.target.value
    if (isNaN(value) || value === ' ') return

    if (error) setError(false)

    const newCode = [...code]
    newCode[index] = value.substring(value.length - 1)
    setCode(newCode)

    if (value !== '' && index < 5) {
      inputs.current[index + 1].focus()
    }
  }

  const handleResend = () => {
    // Logic for resending code can be added here if needed
    setCode(['', '', '', '', '', ''])
    setError(false)
    if (inputs.current[0]) {
      inputs.current[0].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('')

    if (pastedData.length === 0) return

    if (error) setError(false)

    const newCode = [...code]
    pastedData.forEach((char, i) => {
      newCode[i] = char
    })
    setCode(newCode)

    const focusIndex = pastedData.length < 6 ? pastedData.length : 5
    inputs.current[focusIndex].focus()
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-between" dir="rtl">
      <div className="w-full text-center">
        <h1
          className="text-xl font-bold tracking-tight text-white sm:text-[24px]"
          style={{ lineHeight: '100%' }}
        >
          ادخال الكود
        </h1>
        <p
          className="mx-auto mt-8 max-w-[450px] text-base font-bold text-white/90 sm:mt-12 sm:text-[18px]"
          style={{ lineHeight: '140%' }}
        >
          قم بإدخال الكود الذي قمنا بارساله إلى بريدك الإلكتروني لتأكيد الحساب
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 w-full max-w-[580px] space-y-8 sm:mt-6 sm:space-y-10"
      >
        <div className="flex w-full flex-col items-center gap-2">
          <div
            className="flex w-full items-center justify-center gap-2 sm:gap-4"
            dir="ltr"
          >
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
                className={`h-12 w-12 rounded-[12px] bg-white/90 text-center text-[24px] font-bold shadow-[0px_4px_7.6px_0px_#0000001A] transition-all focus:ring-2 focus:ring-[#2496FF] focus:outline-none sm:h-16 sm:w-16 sm:rounded-[15px] sm:text-[28px] ${
                  error
                    ? 'border-2 border-[#F44336] text-[#F44336]'
                    : 'border-none text-black'
                }`}
              />
            ))}
          </div>

          <div className="mt-1 w-full max-w-[340px] sm:max-w-[440px]">
            <button
              type="button"
              onClick={handleResend}
              className="float-left text-[13px] font-bold text-white transition-opacity hover:opacity-80 sm:text-[15px]"
            >
              اعد ارسال الكود؟
            </button>
            <div className="clear-both"></div>
          </div>
        </div>

        <Button
          disabled={isSubmitting || code.join('').length < 6}
          className={`mx-auto flex h-11 w-full items-center justify-center rounded-[10px] text-[18px] font-bold text-white shadow-lg transition-all active:scale-[0.98] sm:h-[50px] sm:w-[350px] sm:text-[20px] ${
            isSubmitting
              ? 'bg-[#459F49] shadow-[#459F49]/20 hover:bg-[#3A8A3F]'
              : 'bg-[#2496FF] shadow-[#2496FF]/10 hover:bg-[#1C7ED6]'
          }`}
          style={{ lineHeight: '100%' }}
        >
          {isSubmitting ? 'جاري التحقق...' : 'تأكيد الحساب'}
        </Button>
      </form>
    </div>
  )
}

export default VerifyStep
