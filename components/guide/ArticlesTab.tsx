'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Share2, Download, Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { ARTICLES } from '@/data/healthGuideData'

interface Props { query: string }

export default function ArticlesTab({ query }: Props) {
  const router = useRouter()
  const list = ARTICLES.filter(a => a.category === 'articles' &&
    (a.title.includes(query) || a.desc.includes(query) || query === ''))

  const [savedArticles, setSavedArticles] = useState<string[]>([])

  useEffect(() => {
    setSavedArticles(JSON.parse(localStorage.getItem('saved-articles') || '[]'))
  }, [])

  const handleShare = async (id: string, title: string, desc: string) => {
    const url = `${window.location.origin}/health-guide/article/${id}`
    try {
      if (navigator.share) {
        await navigator.share({ title, text: desc, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      // do nothing
    }
  }

  const handleDownload = (id: string, title: string) => {
    const article = ARTICLES.find(a => a.id === id)
    if (!article) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar"><head><meta charset="UTF-8"/><title>${title}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Cairo',Arial,sans-serif;direction:rtl;padding:40px;color:#1e293b;max-width:800px;margin:0 auto;font-size:14px;line-height:1.8}
h1{color:#2196F3;font-size:22px;margin-bottom:6px;font-weight:900}.meta{color:#64748b;font-size:12px;margin-bottom:18px;border-bottom:2px solid #e2e8f0;padding-bottom:10px}
.intro{background:#EFF6FF;border-right:4px solid #2196F3;padding:14px;border-radius:8px;margin-bottom:18px;color:#1e40af;font-weight:700}
.step{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:10px}
.step h2{font-size:14px;font-weight:900;color:#1e293b;margin-bottom:4px}.step p{color:#475569;font-size:13px}
.warning{background:#FEF9C3;border-right:4px solid #EAB308;padding:12px;border-radius:8px;margin-top:14px}
.tip{background:#F0FDF4;border-right:4px solid #22C55E;padding:12px;border-radius:8px;margin-top:10px}
.label{font-weight:900;font-size:12px;margin-bottom:3px}@media print{body{padding:20px}}</style></head>
<body><h1>${title}</h1>
<div class="meta">وقت القراءة: ${article.readTime} • المصدر: نجاة – الدليل الصحي</div>
<div class="intro">${article.content.intro}</div>
${article.content.steps.map((s, i) => `<div class="step"><h2>${i + 1}. ${s.title}</h2><p>${s.body}</p></div>`).join('')}
${article.content.warning ? `<div class="warning"><div class="label">⚠️ تحذير</div>${article.content.warning}</div>` : ''}
${article.content.tip ? `<div class="tip"><div class="label">💡 نصيحة</div>${article.content.tip}</div>` : ''}
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
</body></html>`)
    printWindow.document.close()
  }

  const handleSave = (id: string) => {
    const saved = [...savedArticles]
    if (saved.includes(id)) {
      const updated = saved.filter(s => s !== id)
      setSavedArticles(updated)
      localStorage.setItem('saved-articles', JSON.stringify(updated))
    } else {
      const updated = [...saved, id]
      setSavedArticles(updated)
      localStorage.setItem('saved-articles', JSON.stringify(updated))
    }
  }

  const isSaved = (id: string) => savedArticles.includes(id)

  if (list.length === 0)
    return <p className="text-center text-slate-400 font-bold py-20">لا توجد نتائج مطابقة للبحث</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {list.map((article) => (
        <div
          key={article.id}
          className="bg-white rounded-[20px] border border-slate-100 p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer"
        >
          {/* Title & Description */}
          <div
            className="flex flex-col gap-1.5 text-right"
            onClick={() => router.push(`/health-guide/article/${article.id}`)}
          >
            <h3 className="text-[15px] sm:text-[17px] font-black text-black group-hover:text-[#2196F3] transition-colors leading-snug">
              {article.title}
            </h3>
            <p className="text-black/70 text-[12px] sm:text-[13px] font-bold leading-relaxed">
              {article.desc}
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-1" style={{ direction: 'ltr' }}>
            <div className="flex items-center gap-4">
              <button
                aria-label="مشاركة"
                onClick={() => handleShare(article.id, article.title, article.desc)}
                className="text-[#2196F3] hover:text-blue-700 transition-colors"
              >
                <Share2 size={18} />
              </button>
              <button
                aria-label="تحميل"
                onClick={() => handleDownload(article.id, article.title)}
                className="text-[#2196F3] hover:text-blue-700 transition-colors"
              >
                <Download size={18} />
              </button>
              <button
                aria-label="حفظ"
                onClick={() => handleSave(article.id)}
                className={`transition-colors ${isSaved(article.id) ? 'text-blue-600' : 'text-[#2196F3] hover:text-blue-700'}`}
              >
                <Bookmark size={18} fill={isSaved(article.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button
              onClick={() => router.push(`/health-guide/article/${article.id}`)}
              className="bg-[#2196F3] text-white text-[12px] sm:text-[13px] font-black px-8 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-sm min-w-[120px] text-center"
            >
              انتقل الآن
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
