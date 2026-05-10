import React from 'react'
import Image from 'next/image'
import { MapPin, TriangleAlert, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SharedHeroHeaderProps {
  hospital: any
  onShowMap?: () => void
  onCall?: () => void
}

export default function SharedHeroHeader({ hospital, onShowMap, onCall }: SharedHeroHeaderProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Hero header ── */
        .shared-hero { height: 480px; border-radius: 32px; }
        @media (max-width: 768px) { .shared-hero { height: 320px; border-radius: 20px; } }

        /* ── Hero title ── */
        .shared-title { font-size: 3.75rem; }
        @media (max-width: 768px) { .shared-title { font-size: 1.5rem; } }

        /* ── Hero address text ── */
        .shared-address { font-size: 1.25rem; }
        @media (max-width: 768px) { .shared-address { font-size: 0.8rem; } }

        /* ── Bottom-right content block ── */
        .shared-hero-content { bottom: 2.5rem; right: 2.5rem; gap: 1rem; }
        @media (max-width: 768px) { .shared-hero-content { bottom: 4.5rem; right: 1rem; gap: 0.5rem; } }

        /* ── Bottom-left buttons block ── */
        .shared-hero-btns { bottom: 2.5rem; left: 2.5rem; gap: 1rem; }
        .shared-btn { height: 44px; padding: 10px 24px; font-size: 13px; }
        @media (max-width: 768px) { 
          .shared-hero-btns { bottom: 1rem; right: 1rem; left: 1rem; gap: 0.5rem; justify-content: flex-start; flex-wrap: wrap; }
          .shared-btn { height: 34px; padding: 6px 12px; font-size: 11px; border-radius: 12px !important; }
        }

        /* ── Hero badges ── */
        .shared-badge { padding: 8px 20px; font-size: 13px; }
        @media (max-width: 768px) { .shared-badge { padding: 4px 10px; font-size: 10px; } }
      `}} />

      <div className="shared-hero relative w-full overflow-hidden shadow-2xl flex-shrink-0">
        <Image src="/assets/health1.jpg" alt="Hospital Header" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Bottom-right: title + badges */}
        <div className="shared-hero-content absolute flex flex-col items-start text-white text-right">
          <div className="flex flex-wrap items-center gap-2 mb-1 w-full">
            <div className="shared-badge bg-amber-500 text-white rounded-full font-black flex items-center gap-2 shadow-lg">
              <TriangleAlert size={14} />
              قدرة استيعابية محدودة
            </div>
            <div className="shared-badge bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-black shadow-lg">
              آخر تحديث منذ 15 دقيقة
            </div>
          </div>
          <h1 className="shared-title font-black mb-1 drop-shadow-lg leading-tight">{hospital?.name || 'مستشفى شهداء الأقصى'}</h1>
          <div className="shared-address flex items-center gap-2 font-bold drop-shadow-md">
            <img src="https://api.iconify.design/solar:map-point-bold.svg?color=white" alt="Location" className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>{hospital?.address || 'غزة - الرمال - شارع الشهداء'}</span>
          </div>
        </div>

        {/* Bottom-left: action buttons */}
        <div className="shared-hero-btns absolute flex items-center">
          <Button onClick={onCall} className="shared-btn bg-white text-slate-800 hover:bg-slate-100 font-black rounded-2xl flex items-center gap-2 shadow-xl">
            <Phone size={16} className="text-blue-500" />
            اتصال
          </Button>
          <Button onClick={onShowMap} className="shared-btn bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/30">
            <MapPin size={16} />
            عرض الخريطة
          </Button>
        </div>
      </div>
    </>
  )
}
