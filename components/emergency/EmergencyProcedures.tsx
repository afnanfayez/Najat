'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ProcedureAccordionProps {
  title: string
  content: string[]
  isOpen: boolean
  onToggle: () => void
}

function ProcedureAccordion({ title, content, isOpen, onToggle }: ProcedureAccordionProps) {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-4 transition-all">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <span className="font-bold text-slate-800 text-right">{title}</span>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-5 pt-2 text-right border-t border-slate-50 bg-slate-50/50">
          <ul className="flex flex-col gap-3">
            {content.map((item, idx) => (
              <li key={idx} className="flex items-start justify-start gap-3 text-sm text-slate-600 font-medium">
                <span className="text-blue-500 text-xl leading-none mt-0.5">•</span>
                <span className="text-right">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function EmergencyProcedures() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const procedures = [
    {
      title: 'إذا كان الحريق صغيراً',
      content: [
        'حاول إطفاءه بطفاية حريق أو بطانية',
        'أغلق باب الغرفة لعزل النيران'
      ]
    },
    {
      title: 'إذا كان الحريق كبيراً',
      content: [
        'اخرج فوراً من المبنى عبر أقرب مخرج آمن',
        'لا تستخدم المصاعد أبداً',
        'اتصل بالدفاع المدني (998) من مكان آمن'
      ]
    },
    {
      title: 'إذا اشتعلت النيران في ملابسك',
      content: [
        'توقف عن الركض فوراً',
        'انبطح على الأرض وغط وجهك بيديك',
        'تدحرج جيئة وذهاباً حتى تنطفئ النيران'
      ]
    }
  ]

  return (
    <div className="w-full mt-4" dir="rtl">
      <h2 className="text-xl font-bold text-slate-800 mb-6 text-right">إجراءات الطوارئ</h2>
      <div className="flex flex-col">
        {procedures.map((proc, idx) => (
          <ProcedureAccordion 
            key={idx}
            title={proc.title}
            content={proc.content}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  )
}
