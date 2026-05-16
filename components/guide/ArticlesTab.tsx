'use client'

import React from 'react'
import { Share2, Download, Bookmark } from 'lucide-react'

const ARTICLE_CARDS = [
  { title: 'كيف تحمي نفسك من الأمراض في ظل انقطاع المياه', desc: 'نصائح عملية للحفاظ على النظافة الشخصية وتجنب الأمراض المعدية عند شح المياه.' },
  { title: 'أهمية التطعيمات للأطفال في زمن الحرب', desc: 'لماذا لا تؤجل تطعيم طفلك رغم الظروف الصعبة؟' },
  { title: 'مرضى الضغط والسكري في الحرب: كيف تدير صحتك؟', desc: 'إرشادات يومية لمرضى الأمراض المزمنة عند نقص الأدوية.' },
  { title: 'كيف تتعامل مع القلق والخوف أثناء القصف', desc: 'تمارين تنفس وسلوكيات بسيطة لتخفيف التوتر.' },
  { title: 'الرضاعة الطبيعية في ظل الحرب: تحديات وحلول', desc: 'نصائح للأمهات للحفاظ على الرضاعة رغم التوتر وسوء التغذية.' },
  { title: 'كيف تحمي طفلك من الحوادث المنزلية في الطوارئ', desc: 'نصائح لتأمين المنزل أثناء الأزمات.' },
  { title: 'الإسعافات الأولية للحروق في المنزل', desc: 'ما يجب فعله وما يجب تجنبه فوراً.' },
  { title: 'كيف تتصرف عند انهيار مبنى قريب منك؟', desc: 'خطوات السلامة أثناء وبعد الحدث.' },
  { title: 'مخاطر استخدام الشموع في الخيام ونصائح للوقاية', desc: 'كيف تمنع الحرائق في ظل انقطاع الكهرباء.' },
  { title: 'سلامة الأطفال في المناطق غير الآمنة', desc: 'تأمين محيط الطفل في المخيمات.' },
]

export default function ArticlesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {ARTICLE_CARDS.map((article, i) => (
        <div
          key={i}
          className="bg-white rounded-[20px] border border-slate-100 p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer"
        >
          {/* Title & Description */}
          <div className="flex flex-col gap-1.5 text-right">
            <h3 className="text-[15px] sm:text-[17px] font-black text-black group-hover:text-[#2196F3] transition-colors leading-snug">
              {article.title}
            </h3>
            <p className="text-black/70 text-[12px] sm:text-[13px] font-bold leading-relaxed">
              {article.desc}
            </p>
          </div>

          {/* Bottom row: icons left — button right */}
          <div className="flex items-center justify-between mt-1" style={{ direction: 'ltr' }}>
            <div className="flex items-center gap-4">
              <button aria-label="مشاركة" className="text-[#2196F3] hover:text-blue-700 transition-colors">
                <Share2 size={18} />
              </button>
              <button aria-label="تحميل" className="text-[#2196F3] hover:text-blue-700 transition-colors">
                <Download size={18} />
              </button>
              <button aria-label="حفظ" className="text-[#2196F3] hover:text-blue-700 transition-colors">
                <Bookmark size={18} />
              </button>
            </div>
            <button className="bg-[#2196F3] text-white text-[12px] sm:text-[13px] font-black px-8 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-sm min-w-[120px] text-center">
              انتقل الآن
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
