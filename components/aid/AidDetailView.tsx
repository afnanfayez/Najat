'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ArrowRight, ExternalLink, MapPin, Send } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { aidAPI } from '@/lib/api/aid'
import { submitAidHelpRequest } from '@/lib/api/submitAidHelpRequest'
import { metersToKmLabel } from '@/lib/mappers/hospital'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import {
  aidHelpRequestFormSchema,
  type AidHelpRequestForm,
} from '@/schemas/aidHelpRequest'
import type { NearbyAidPointDto } from '@/schemas/aidApi'

interface AidDetailViewProps {
  aid: HumanitarianAid
  onBack: () => void
}

function nearbyStatusStyle(status: string): {
  text: string
  color: string
  bg: string
} {
  const s = status.toLowerCase()
  if (s === 'active') {
    return { text: 'نشط', color: '#4caf50', bg: '#4caf5015' }
  }
  if (s === 'limited') {
    return { text: 'محدود', color: '#ff9800', bg: '#ff980015' }
  }
  return { text: 'موقوف', color: '#f44336', bg: '#f4433615' }
}

function displayName(p: NearbyAidPointDto): string {
  const label = p.label?.trim()
  if (label) return label
  return p.name
}

function isGeolocationSupportedOnNavigator(): boolean {
  return (
    typeof navigator !== 'undefined' && Boolean(navigator.geolocation)
  )
}

const clientSnapshotSubscribe = () => () => {}

export default function AidDetailView({ aid, onBack }: AidDetailViewProps) {
  const [isMobile, setIsMobile] = useState(false)
  const isClient = useSyncExternalStore(
    clientSnapshotSubscribe,
    () => true,
    () => false,
  )
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null)
  const [geoMessage, setGeoMessage] = useState<string | null>(null)
  const geoApiAvailable = isClient && isGeolocationSupportedOnNavigator()
  const geoUnsupported = isClient && !isGeolocationSupportedOnNavigator()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const requestGeo = useCallback(() => {
    if (!isGeolocationSupportedOnNavigator()) return
    setGeoMessage(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoMessage(null)
      },
      () => {
        setGeoMessage(
          'لم يتم منح إذن الموقع. فعّل تحديد الموقع ثم اضغط "تحديث" أو أعِد تحميل الصفحة.',
        )
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 20_000 },
    )
  }, [])

  useEffect(() => {
    if (!isClient) return
    requestGeo()
  }, [isClient, requestGeo])

  const nearbyQuery = useQuery({
    queryKey: ['aid', 'nearby', geo?.lat, geo?.lng],
    queryFn: () =>
      aidAPI.nearby({ lat: geo!.lat, lng: geo!.lng, radius: 5000 }),
    enabled: geo != null,
  })

  const sortedNearby = useMemo(() => {
    const list = nearbyQuery.data ?? []
    return [...list].sort((a, b) => a.distance - b.distance)
  }, [nearbyQuery.data])

  const form = useForm<AidHelpRequestForm>({
    resolver: zodResolver(
      aidHelpRequestFormSchema,
    ) as Resolver<AidHelpRequestForm>,
    defaultValues: {
      aidOrganizationId: aid.id,
      husbandName: '',
      husbandNationalId: '',
      wifeName: '',
      wifeNationalId: '',
      daughtersCount: 0,
      sonsCount: 0,
      phone: '',
      currentLocation: '',
    },
  })

  useEffect(() => {
    form.setValue('aidOrganizationId', aid.id)
  }, [aid.id, form])

  const mutation = useMutation({
    mutationFn: submitAidHelpRequest,
    onSuccess: (result) => {
      if (result.ok) {
        toast.success(result.message)
        form.reset({
          aidOrganizationId: aid.id,
          husbandName: '',
          husbandNationalId: '',
          wifeName: '',
          wifeNationalId: '',
          daughtersCount: 0,
          sonsCount: 0,
          phone: '',
          currentLocation: '',
        })
      } else {
        toast.error(result.message)
      }
    },
    onError: () => {
      toast.error('تعذر إرسال الطلب. تحقق من الاتصال وحاول مرة أخرى.')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '16px' : '24px',
        direction: 'rtl',
        fontFamily: "'Cairo', sans-serif",
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        padding: isMobile ? '10px 0' : '10px 4px',
      }}
      className="no-scrollbar"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#2196F3',
          width: 'fit-content',
          marginBottom: '8px',
        }}
        onClick={onBack}
      >
        <ArrowRight size={20} />
        <span style={{ fontWeight: 700, fontSize: '16px' }}>العودة للمساعدات</span>
      </div>

      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: 'none',
          padding: isMobile ? '24px' : '48px',
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <h1
            style={{
              fontSize: isMobile ? '32px' : '42px',
              fontWeight: 800,
              color: '#2196F3',
              margin: 0,
              lineHeight: '1.3',
            }}
          >
            {aid.name}
          </h1>
          <p
            style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#B0B0B0',
              margin: '4px 0 24px',
              fontWeight: 600,
            }}
          >
            {aid.provider}
          </p>
          <p
            style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#000',
              fontWeight: 600,
              maxWidth: '1000px',
              marginLeft: 'auto',
              lineHeight: '1.8',
            }}
          >
            {aid.description}
          </p>
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2.5fr 1fr',
          gap: '24px',
          alignItems: 'start',
          paddingBottom: '32px',
        }}
      >
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: 'none',
            padding: isMobile ? '20px' : '32px',
            order: isMobile ? 2 : 0,
          }}
        >
          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            style={{ margin: 0 }}
          >
            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
              <h2
                style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 800,
                  color: '#1a2d4a',
                  margin: 0,
                }}
              >
                طلب مساعدة جديدة
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: '#9e9e9e',
                  fontWeight: 600,
                  marginTop: '8px',
                }}
              >
                يرجى ملء البيانات المطلوبة لضمان معالجة طلبكم بسرعة
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '20px 32px',
              }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  اسم الزوج
                </Label>
                <Input
                  {...register('husbandName')}
                  placeholder="الاسم كامل"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.husbandName ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {errors.husbandName.message}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  رقم هوية الزوج
                </Label>
                <Input
                  {...register('husbandNationalId')}
                  placeholder="مثال: 4030XXXXXX"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.husbandNationalId ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {errors.husbandNationalId.message}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  اسم الزوجة
                </Label>
                <Input
                  {...register('wifeName')}
                  placeholder="الاسم كامل"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.wifeName ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {errors.wifeName.message}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  رقم هوية الزوجة
                </Label>
                <Input
                  {...register('wifeNationalId')}
                  placeholder="مثال: 4030XXXXXX"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.wifeNationalId ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {errors.wifeNationalId.message}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  عدد الإناث
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register('daughtersCount')}
                  placeholder="0"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.daughtersCount ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {String(errors.daughtersCount.message)}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  عدد الذكور
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register('sonsCount')}
                  placeholder="0"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.sonsCount ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {String(errors.sonsCount.message)}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  رقم الهاتف
                </Label>
                <Input
                  {...register('phone')}
                  placeholder="0590000000"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.phone ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {errors.phone.message}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>
                  الموقع الحالي
                </Label>
                <Input
                  {...register('currentLocation')}
                  placeholder="المنطقة / الحي / أقرب معلم"
                  className="bg-[#f8fafc] border-none h-12 text-right"
                />
                {errors.currentLocation ? (
                  <span style={{ fontSize: '12px', color: '#f44336' }}>
                    {errors.currentLocation.message}
                  </span>
                ) : null}
              </div>
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white h-14 rounded-xl mt-8 flex items-center justify-center gap-2 text-lg font-bold disabled:opacity-60"
            >
              {mutation.isPending ? 'جاري الإرسال...' : 'إرسال الطلب الآن'}
              <Send size={20} />
            </Button>
          </form>
        </Card>

        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: 'none',
            padding: isMobile ? '20px' : '24px',
            order: isMobile ? 1 : 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              gap: '8px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#1a2d4a',
                margin: 0,
              }}
            >
              نقاط التوزيع القريبة
            </h3>
            <button
              type="button"
              onClick={() => {
                requestGeo()
                if (geo) nearbyQuery.refetch()
              }}
              style={{
                fontSize: '12px',
                color: '#2196F3',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              تحديث
            </button>
          </div>

          {geoUnsupported ? (
            <p style={{ fontSize: '13px', color: '#f44336', margin: 0 }}>
              المتصفح لا يدعم تحديد الموقع
            </p>
          ) : geoMessage ? (
            <div>
              <p style={{ fontSize: '13px', color: '#f44336', margin: '0 0 8px' }}>{geoMessage}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  background: '#2196F3',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                إعادة تحميل الصفحة
              </button>
            </div>
          ) : !geo ? (
            <p style={{ fontSize: '14px', color: '#9e9e9e', margin: 0 }}>
              جارٍ تحديد موقعك...
            </p>
          ) : nearbyQuery.isLoading ? (
            <p style={{ fontSize: '14px', color: '#9e9e9e' }}>جاري تحميل النقاط القريبة...</p>
          ) : nearbyQuery.isError ? (
            <p style={{ fontSize: '13px', color: '#f44336' }}>
              {(nearbyQuery.error as any)?.status === 401
                ? 'يرجى تسجيل الدخول أولاً لعرض نقاط التوزيع القريبة.'
                : 'تعذر تحميل النقاط. تحقق من الاتصال وحاول مرة أخرى.'}
            </p>
          ) : sortedNearby.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#9e9e9e' }}>
              لا توجد نقاط توزيع ضمن نطاق 5 كم من موقعك.
            </p>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sortedNearby.map((point) => {
              const st = nearbyStatusStyle(String(point.status))
              const supplies = (point.availableSupplies ?? [])
                .slice(0, 4)
                .join('، ')
              const mapsUrl = `https://www.google.com/maps?q=${point.latitude},${point.longitude}`
              return (
                <div
                  key={point.id}
                  style={{
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      gap: '8px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#1a2d4a',
                          margin: 0,
                        }}
                      >
                        {displayName(point)}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#9e9e9e',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      >
                        <MapPin size={12} />
                        <span>
                          على بُعد {metersToKmLabel(point.distance)} من موقعك
                        </span>
                      </div>
                      {supplies ? (
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#616161',
                            margin: '8px 0 0',
                            lineHeight: 1.5,
                          }}
                        >
                          {supplies}
                        </p>
                      ) : null}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          color: '#2196F3',
                          marginTop: '8px',
                          fontWeight: 700,
                        }}
                      >
                        فتح على الخرائط
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div style={{ textAlign: 'left', minWidth: '88px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: st.color,
                          fontSize: '11px',
                          fontWeight: 800,
                          background: st.bg,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: st.color,
                          }}
                        />
                        <span>{st.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
