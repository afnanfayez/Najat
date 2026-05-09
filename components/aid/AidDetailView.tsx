'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Send, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'

interface AidDetailViewProps {
  aid: HumanitarianAid
  onBack: () => void
}

const DISTRIBUTION_POINTS = [
  { id: 1, name: 'مركز شباب الأمل', location: 'خان يونس - غزة', status: 'مفتوح الآن', time: 'يغلق 8:00 م' },
  { id: 2, name: 'مركز شباب الأمل', location: 'خان يونس - غزة', status: 'مغلق الآن', time: 'يفتح 8:00 ص' },
  { id: 3, name: 'مركز شباب الأمل', location: 'خان يونس - غزة', status: 'مغلق الآن', time: 'يفتح 8:00 ص' },
  { id: 4, name: 'مركز شباب الأمل', location: 'خان يونس - غزة', status: 'مفتوح الآن', time: 'يغلق 8:00 م' },
  { id: 5, name: 'مركز شباب الأمل', location: 'خان يونس - غزة', status: 'مفتوح الآن', time: 'يغلق 8:00 م' },
]

export default function AidDetailView({ aid, onBack }: AidDetailViewProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      {/* Back Button */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: 'pointer', 
          color: '#2196F3', 
          width: 'fit-content',
          marginBottom: '8px'
        }} 
        onClick={onBack}
      >
        <ArrowRight size={20} />
        <span style={{ fontWeight: 700, fontSize: '16px' }}>العودة للمساعدات</span>
      </div>

      {/* Header Card */}
      <Card style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: 'none', padding: isMobile ? '24px' : '48px', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: 800, color: '#2196F3', margin: 0, lineHeight: '1.3' }}>{aid.name}</h1>
          <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#B0B0B0', margin: '4px 0 24px', fontWeight: 600 }}>{aid.provider}</p>
          <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#000', fontWeight: 600, maxWidth: '1000px', marginLeft: 'auto', lineHeight: '1.8' }}>
            {aid.description}
          </p>
        </div>
      </Card>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '2.5fr 1fr', 
        gap: '24px', 
        alignItems: 'start',
        paddingBottom: '32px'
      }}>
        
        {/* Right Column: Request Form (Order 2 on mobile) */}
        <Card style={{ 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
          border: 'none', 
          padding: isMobile ? '20px' : '32px',
          order: isMobile ? 2 : 0
        }}>
          <div style={{ textAlign: 'right', marginBottom: '32px' }}>
            <h2 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 800, color: '#1a2d4a', margin: 0 }}>طلب مساعدة جديدة</h2>
            <p style={{ fontSize: '14px', color: '#9e9e9e', fontWeight: 600, marginTop: '8px' }}>يرجى ملئ البيانات المطلوبة لضمان معالجة طلبكم بسرعة</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>اسم الزوج</Label>
              <Input placeholder="الاسم كامل" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>رقم هوية الزوج</Label>
              <Input placeholder="مثال : 8 افراد" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>اسم الزوجة</Label>
              <Input placeholder="الاسم كامل" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>رقم هوية الزوجة</Label>
              <Input placeholder="مثال : 8 افراد" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>عدد الابناء الاناث</Label>
              <Input placeholder="مثال : 4 افراد" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>عدد الابناء الذكور</Label>
              <Input placeholder="مثال : 8 افراد" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>رقم الهاتف</Label>
              <Input placeholder="0590000000" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>الموقع الحالي</Label>
              <Input placeholder="حدد موقعك الحالي" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label style={{ fontSize: '15px', fontWeight: 800, color: '#000' }}>ملاحظات إضافية</Label>
              <Input placeholder="اكتب ملاحظاتك هنا" className="bg-[#f8fafc] border-none h-12 text-right" />
            </div>
          </div>

          <Button className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white h-14 rounded-xl mt-8 flex items-center justify-center gap-2 text-lg font-bold">
             إرسال الطلب الآن
             <Send size={20} />
          </Button>
        </Card>

        {/* Left Column: Distribution Points (Order 1 on mobile) */}
        <Card style={{ 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
          border: 'none', 
          padding: isMobile ? '20px' : '24px',
          order: isMobile ? 1 : 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a2d4a', margin: 0 }}>نقاط التوزيع القريبة</h3>
             <span style={{ fontSize: '12px', color: '#9e9e9e', fontWeight: 600 }}>عرض الكل</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {DISTRIBUTION_POINTS.map((point) => (
              <div key={point.id} style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1a2d4a', margin: 0 }}>{point.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9e9e9e', fontSize: '12px', marginTop: '4px' }}>
                      <MapPin size={12} />
                      <span>{point.location}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left', minWidth: '100px' }}>
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        color: point.status === 'مفتوح الآن' ? '#4caf50' : '#f44336', 
                        fontSize: '11px', 
                        fontWeight: 800,
                        background: point.status === 'مفتوح الآن' ? '#4caf5015' : '#f4433615',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: point.status === 'مفتوح الآن' ? '#4caf50' : '#f44336' }} />
                      <span>{point.status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f2a122', fontSize: '11px', marginTop: '6px', justifyContent: 'center' }}>
                      <Clock size={12} />
                      <span>{point.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
