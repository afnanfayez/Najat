'use client'

import React from 'react'
import { Phone, ChevronLeft, Eye, Clock } from 'lucide-react'
import Image from 'next/image'

const FIRST_AID_CARDS = [
  {
    title: 'التعامل مع النزيف الحاد',
    desc: 'تعرف على كيفية الضغط المباشر واستخدام العصبة لوقف النزيف.',
    image: '/assets/healthcare1.jpg',
  },
  {
    title: 'الإنعاش القلبي الرئوي (CPR)',
    desc: 'دليل مبسط للبالغين والأطفال حول وضعية الضغطات الصدرية الصحيحة.',
    image: '/assets/healthcare2.jpg',
  },
  {
    title: 'علاج الحروق الطفيفة',
    desc: 'كيفية تبريد الحروق وتغطيتها بشكل آمن لتجنب الالتهابات.',
    image: '/assets/healthcare3.jpg',
  },
]

const MENTAL_TOOLS = [
  { label: 'تمارين تنفس', icon: 'https://api.iconify.design/solar:wind-bold.svg?color=white' },
  { label: 'تأمل وتوجيه', icon: 'https://api.iconify.design/solar:user-bold.svg?color=white' },
  { label: 'تمارين تنفس', icon: 'https://api.iconify.design/solar:sleeping-bold.svg?color=white' },
  { label: 'تمارين تنفس', icon: 'https://api.iconify.design/solar:heart-bold.svg?color=white' },
]

const ARTICLES = [
  { title: 'دليل النظافة والتعقيم في ظل نقص الموارد', time: '5 دقائق قراءة', views: '1.2k مشاهدة', image: '/assets/artical.png' },
  { title: 'دليل النظافة والتعقيم في ظل نقص الموارد', time: '5 دقائق قراءة', views: '1.2k مشاهدة', image: '/assets/artical.png' },
]

export default function FirstAidTab() {
  return (
    <>
      {/* First Aid Cards */}
      <div className="mb-8 sm:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {FIRST_AID_CARDS.map((card, i) => (
            <div key={i} className="group relative h-[220px] sm:h-[280px] rounded-[24px] overflow-hidden shadow-lg shadow-blue-900/5 transition-transform hover:-translate-y-1">
              <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-right">
                <h3 className="text-white text-base sm:text-lg font-black mb-1">{card.title}</h3>
                <p className="text-white/90 text-[12px] sm:text-[14px] font-black mb-4 leading-relaxed line-clamp-2">{card.desc}</p>
                <button className="bg-[#2196F3] text-white py-2.5 rounded-xl font-black text-[12px] sm:text-[13px] hover:bg-blue-600 transition-all shadow-md w-full">
                  انتقل الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mental Health Corner */}
      <div className="mb-8 sm:mb-10 w-full">
        <div className="bg-white rounded-[40px] p-8 sm:p-10 border-2 border-slate-50 shadow-sm flex flex-col lg:flex-row items-center justify-between w-full gap-10" style={{ direction: 'rtl' }}>
          <div className="flex flex-col items-start text-right w-full lg:flex-1">
            <div className="px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-2 mb-4 text-white w-fit" style={{ background: '#459F49' }}>
              <span className="w-2 h-2 bg-white rounded-full" />
              مستشار متاح الآن
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4">ركن الصحة النفسية</h2>
            <p className="text-black text-[15px] sm:text-[19px] font-black leading-relaxed mb-8 w-full">
              نحن هنا لدعمك في تجاوز الأزمات النفسية والتوتر الناتج عن الظروف الصعبة. لا تتردد في طلب المساعدة.
            </p>
            <button className="bg-[#2196F3] text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-[16px] flex items-center gap-3 shadow-lg hover:bg-blue-600 transition-all w-fit">
              <Phone size={20} />
              اتصال هاتفي
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            {MENTAL_TOOLS.map((tool, i) => (
              <button key={i} className="w-[120px] h-[90px] sm:w-[150px] sm:h-[110px] bg-[#2196F3] rounded-[18px] flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md shadow-blue-100">
                <img src={tool.icon} alt={tool.label} className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="text-white text-[11px] font-black">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Awareness Articles List */}
      <div className="text-right">
        <h2 className="text-xl sm:text-2xl font-black text-[#1e293b] mb-4">مقالات توعوية</h2>
        <div className="flex flex-col gap-4">
          {ARTICLES.map((article, i) => (
            <div key={i} className="bg-white rounded-[20px] border-2 border-slate-50 p-3 sm:p-4 flex items-center gap-4 group cursor-pointer hover:border-blue-100 transition-all shadow-sm">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-right flex flex-col gap-1">
                <h3 className="text-[15px] sm:text-[18px] font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{article.title}</h3>
                <div className="flex items-center justify-start gap-5 text-slate-500 text-[13px] sm:text-[14px] font-black">
                  <div className="flex items-center gap-1.5"><Eye size={16} />{article.views}</div>
                  <div className="flex items-center gap-1.5"><Clock size={16} />{article.time}</div>
                </div>
              </div>
              <ChevronLeft className="text-slate-300 group-hover:text-blue-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
