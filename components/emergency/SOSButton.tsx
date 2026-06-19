'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Siren, MapPin, X, CheckCircle2, Loader2, PhoneCall, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

type SOSPhase =
  | 'idle'
  | 'confirm'
  | 'locating'
  | 'sending'
  | 'sent'
  | 'error'

interface GeolocationResult {
  lat: number
  lng: number
  accuracy: number
}

function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

function buildSMSBody(
  senderName: string,
  lat: number | null,
  lng: number | null,
  sosMessage: string,
): string {
  const base = sosMessage.trim() || `🚨 طلب استغاثة عاجل من ${senderName}`
  if (lat && lng) {
    const mapsUrl = getGoogleMapsUrl(lat, lng)
    return encodeURIComponent(`${base}\n📍 الموقع الحالي: ${mapsUrl}`)
  }
  return encodeURIComponent(base)
}

export default function SOSButton() {
  const { user } = useAuth()
  const [phase, setPhase] = useState<SOSPhase>('idle')
  const [location, setLocation] = useState<GeolocationResult | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdStartedRef = useRef(false)
  const HOLD_DURATION_MS = 1200 // 1.2s hold to activate

  const emergencyContacts: { name: string; phone: string }[] =
    ((user as any)?.emergencyContacts as { name: string; phone: string }[] | null) ?? []
  const sosMessage: string = (user as any)?.sosMessage ?? ''
  const senderName: string = user?.fullName ?? 'مستخدم نجاة'

  const getLocation = useCallback((): Promise<GeolocationResult> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('المتصفح لا يدعم تحديد الموقع'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }),
        (err) => reject(new Error(err.message || 'تعذّر الحصول على الموقع')),
        { timeout: 8000, enableHighAccuracy: true },
      )
    })
  }, [])

  const startHold = useCallback(() => {
    if (phase !== 'idle') return
    holdStartedRef.current = true
    setHoldProgress(0)
    const start = Date.now()
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100)
      setHoldProgress(pct)
      if (pct >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
        setPhase('confirm')
        setHoldProgress(0)
      }
    }, 16)
  }, [phase])

  const cancelHold = useCallback(() => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    holdStartedRef.current = false
    setHoldProgress(0)
  }, [])

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    }
  }, [])

  const handleConfirmSOS = useCallback(async () => {
    setPhase('locating')
    setLocationError(null)
    let loc: GeolocationResult | null = null
    try {
      loc = await getLocation()
      setLocation(loc)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'تعذّر تحديد الموقع'
      setLocationError(msg)
    }
    setPhase('sending')

    // Small visual delay to feel intentional
    await new Promise((r) => setTimeout(r, 600))

    if (emergencyContacts.length > 0) {
      const body = buildSMSBody(senderName, loc?.lat ?? null, loc?.lng ?? null, sosMessage)
      const firstContact = emergencyContacts[0]
      const smsLink = `sms:${firstContact.phone}?body=${body}`
      window.open(smsLink, '_blank')
    } else {
      // Fallback: open SMS to civil defense
      const body = buildSMSBody(senderName, loc?.lat ?? null, loc?.lng ?? null, sosMessage)
      toast.warning('لم يتم تحديد جهات اتصال طوارئ. يُرجى إضافتها في إعدادات ملفك الشخصي.')
    }

    setPhase('sent')
  }, [getLocation, emergencyContacts, senderName, sosMessage])

  const resetSOS = useCallback(() => {
    setPhase('idle')
    setLocation(null)
    setLocationError(null)
    setHoldProgress(0)
  }, [])

  // ─── Confirmation Dialog ─────────────────────────────
  if (phase === 'confirm') {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-6">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-red-200 shadow-xl p-6 text-center flex flex-col gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800">تأكيد طلب الاستغاثة</h3>
          <p className="text-sm text-slate-500 font-medium">
            سيتم إرسال رسالة SOS مع موقعك الحالي إلى جهات اتصال الطوارئ المحددة في ملفك الشخصي.
          </p>
          {emergencyContacts.length > 0 && (
            <div className="flex flex-col gap-1.5 bg-red-50 rounded-xl p-3">
              {emergencyContacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">{c.name || 'جهة اتصال'}</span>
                  <span className="text-slate-500 font-mono" dir="ltr">{c.phone}</span>
                </div>
              ))}
            </div>
          )}
          {emergencyContacts.length === 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 font-bold">
              ⚠️ لم تُضف جهات اتصال طوارئ بعد. يُنصح بإضافتها من الملف الشخصي.
            </p>
          )}
          <div className="flex gap-3 mt-2">
            <button
              onClick={resetSOS}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
            >
              <X size={15} />
              إلغاء
            </button>
            <button
              onClick={handleConfirmSOS}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1 shadow-md shadow-red-500/30"
            >
              <Siren size={15} />
              إرسال SOS
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Locating / Sending ─────────────────────────────
  if (phase === 'locating' || phase === 'sending') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5">
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-4 border-red-200 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-red-400 animate-spin border-t-transparent flex items-center justify-center">
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              {phase === 'locating' ? (
                <MapPin className="text-red-500 w-10 h-10 animate-bounce" />
              ) : (
                <Siren className="text-red-500 w-10 h-10" />
              )}
            </div>
          </div>
        </div>
        <p className="text-slate-700 font-bold text-lg">
          {phase === 'locating' ? 'جارٍ تحديد الموقع...' : 'جارٍ إرسال النداء...'}
        </p>
        <p className="text-slate-400 text-sm text-center max-w-xs">
          {phase === 'locating'
            ? 'يُرجى السماح بالوصول لخدمة الموقع إن طُلب منك'
            : 'يتم الآن إرسال رسالة الاستغاثة مع إحداثياتك'}
        </p>
      </div>
    )
  }

  // ─── Sent ────────────────────────────────────────────
  if (phase === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-5">
        <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="text-green-500 w-16 h-16" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-extrabold text-slate-800 mb-1">تم إرسال نداء الاستغاثة</h3>
          {location && (
            <a
              href={getGoogleMapsUrl(location.lat, location.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-500 font-semibold hover:underline mt-1"
            >
              <MapPin size={14} />
              عرض موقعك على الخريطة
            </a>
          )}
          {locationError && (
            <p className="text-xs text-amber-600 mt-1">⚠️ تعذّر تحديد الموقع: {locationError}</p>
          )}
        </div>

        {emergencyContacts.length > 0 && (
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {emergencyContacts.map((c, i) => (
              <a
                key={i}
                href={`tel:${c.phone}`}
                className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-700 text-sm">{c.name || 'جهة اتصال'}</span>
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-bold">
                  <PhoneCall size={15} />
                  اتصل
                </span>
              </a>
            ))}
          </div>
        )}

        <button
          onClick={resetSOS}
          className="mt-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors underline"
        >
          إغلاق
        </button>
      </div>
    )
  }

  // ─── Idle ─────────────────────────────────────────────
  const circumference = 2 * Math.PI * 90 // radius=90 for the SVG circle
  const dashOffset = circumference - (holdProgress / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center py-12 relative select-none">
      {/* Background ripples */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-40 h-40 sm:w-64 sm:h-64 bg-red-500/20 rounded-full animate-ping"
          style={{ animationDuration: '3s' }}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-52 h-52 sm:w-80 sm:h-80 bg-red-400/10 rounded-full animate-ping"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
      </div>

      {/* Progress ring SVG */}
      <div className="relative z-10">
        <svg
          width="220"
          height="220"
          viewBox="0 0 200 200"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
          style={{ opacity: holdProgress > 0 ? 1 : 0, transition: 'opacity 0.2s' }}
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="#fca5a5" strokeWidth="6" />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>

        {/* Main Button */}
        <button
          className="relative w-48 h-48 sm:w-56 sm:h-56 bg-[#F44336] hover:bg-[#E53935] text-white rounded-full flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-[0_0_40px_rgba(244,67,54,0.6)] transition-all active:scale-95 cursor-pointer"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          onTouchCancel={cancelHold}
          aria-label="زر الاستغاثة"
        >
          <Siren className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2.5} />
          <span className="text-4xl sm:text-5xl font-bold tracking-wider mt-1 sm:mt-2">SOS</span>
          <span className="text-sm sm:text-base font-bold opacity-90">طلب استغاثة</span>
        </button>
      </div>

      <p className="mt-16 text-sm font-bold text-slate-600 text-center max-w-xs">
        {holdProgress > 0
          ? 'استمر في الضغط لتأكيد الاستغاثة...'
          : 'اضغط مطولاً على الزر لإرسال نداء استغاثة مع موقعك'}
      </p>
    </div>
  )
}
