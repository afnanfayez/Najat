'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, Share2, Download, Bookmark, AlertTriangle, Lightbulb, CheckCircle, Menu } from 'lucide-react'
import Image from 'next/image'
import { DashboardShellContext } from '@/components/dashboard/DashboardShellContext'
import { toast } from 'sonner'
import type { Article } from '@/data/healthGuideData'

interface Props {
  article: Article
}

export default function ArticleDetailPage({ article }: Props) {
  const router = useRouter()
  const shell = useContext(DashboardShellContext)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /* ── Share ── */
  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.desc, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      // Ignored
    }
  }

  /* ── Download PDF ── */
  const handleDownload = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar"><head><meta charset="UTF-8"/><title>${article.title}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Cairo',Arial,sans-serif;direction:rtl;padding:40px;color:#1e293b;max-width:800px;margin:0 auto;font-size:14px;line-height:1.8}
h1{color:#2196F3;font-size:22px;margin-bottom:6px;font-weight:900}.meta{color:#64748b;font-size:12px;margin-bottom:18px;border-bottom:2px solid #e2e8f0;padding-bottom:10px}
.intro{background:#EFF6FF;border-right:4px solid #2196F3;padding:14px;border-radius:8px;margin-bottom:18px;color:#1e40af;font-weight:700}
.step{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:10px}
.step h2{font-size:14px;font-weight:900;color:#1e293b;margin-bottom:4px}.step p{color:#475569;font-size:13px}
.warning{background:#FEF9C3;border-right:4px solid #EAB308;padding:12px;border-radius:8px;margin-top:14px}
.tip{background:#F0FDF4;border-right:4px solid #22C55E;padding:12px;border-radius:8px;margin-top:10px}
.label{font-weight:900;font-size:12px;margin-bottom:3px}@media print{body{padding:20px}}</style></head>
<body><h1>${article.title}</h1>
<div class="meta">وقت القراءة: ${article.readTime} • المصدر: نجاة – الدليل الصحي</div>
<div class="intro">${article.content.intro}</div>
${article.content.steps.map((s, i) => `<div class="step"><h2>${i + 1}. ${s.title}</h2><p>${s.body}</p></div>`).join('')}
${article.content.warning ? `<div class="warning"><div class="label">⚠️ تحذير</div>${article.content.warning}</div>` : ''}
${article.content.tip ? `<div class="tip"><div class="label">💡 نصيحة</div>${article.content.tip}</div>` : ''}
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
</body></html>`)
    printWindow.document.close()
  }

  /* ── Save / Bookmark ── */
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem('saved-articles') || '[]')
    setIsSaved(saved.includes(article.id))
  }, [article.id])

  const handleSave = () => {
    const saved: string[] = JSON.parse(localStorage.getItem('saved-articles') || '[]')
    if (saved.includes(article.id)) {
      const updated = saved.filter(id => id !== article.id)
      localStorage.setItem('saved-articles', JSON.stringify(updated))
      setIsSaved(false)
    } else {
      localStorage.setItem('saved-articles', JSON.stringify([...saved, article.id]))
      setIsSaved(true)
    }
  }

  return (
    <div
      className="h-screen w-full overflow-y-auto no-scrollbar"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", background: '#F4F7FB' }}
    >
      {isMobile && (
        <div
          className="px-4"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e8eef5',
            backgroundColor: '#F4F7FB',
            flexShrink: 0,
          }}
        >
          <div 
            style={{ color: '#2196F3', cursor: 'pointer' }}
            onClick={() => shell?.setIsMobileMenuOpen(true)}
          >
            <Menu size={32} />
          </div>
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            <Image
              src="/assets/Logo2.png"
              alt="شعار نجاة"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
      )}

      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#2196F3] font-black text-[14px] hover:gap-3 transition-all"
        >
          <ArrowRight size={18} />
          عودة للدليل الصحي
        </button>
        <div className="flex items-center gap-3">
          <button onClick={handleShare} aria-label="مشاركة" className="p-2 rounded-xl hover:bg-blue-50 text-[#2196F3] transition-colors">
            <Share2 size={18} />
          </button>
          <button onClick={handleDownload} aria-label="تحميل" className="p-2 rounded-xl hover:bg-blue-50 text-[#2196F3] transition-colors">
            <Download size={18} />
          </button>
          <button onClick={handleSave} aria-label="حفظ" className={`p-2 rounded-xl transition-colors ${isSaved ? 'bg-blue-50 text-[#2196F3]' : 'hover:bg-blue-50 text-slate-400'}`}>
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* ── Main Content (100vh scroll container) ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 pb-16">

        {/* Header */}
        <div className="mb-6">
          <span className="inline-block bg-[#2196F3]/10 text-[#2196F3] text-[11px] font-black px-3 py-1 rounded-full mb-3">
            {article.category === 'first-aid' ? 'إسعافات أولية' : article.category === 'mental' ? 'صحة نفسية' : 'مقالات توعوية'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] mb-3 leading-snug">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-400 text-[13px] font-bold">
            <Clock size={14} />
            <span>{article.readTime} قراءة</span>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-[#EFF6FF] border-r-4 border-[#2196F3] rounded-[16px] p-5 mb-6">
          <p className="text-slate-700 text-[14px] sm:text-[16px] font-bold leading-relaxed">
            {article.content.intro}
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4 mb-6">
          {article.content.steps.map((step, i) => (
            <div key={i} className="bg-white rounded-[20px] border border-slate-100 p-5 shadow-sm flex gap-4">
              <div className="w-9 h-9 rounded-full bg-[#2196F3] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={18} className="text-white" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <h2 className="text-[15px] sm:text-[17px] font-black text-slate-800">
                  {i + 1}. {step.title}
                </h2>
                <p className="text-slate-600 text-[13px] sm:text-[15px] font-bold leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        {article.content.warning && (
          <div className="bg-amber-50 border-r-4 border-amber-400 rounded-[16px] p-5 mb-4 flex gap-3">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-right">
              <p className="font-black text-amber-800 text-[13px] mb-1">تحذير مهم</p>
              <p className="text-amber-700 text-[13px] font-bold leading-relaxed">{article.content.warning}</p>
            </div>
          </div>
        )}

        {/* Tip */}
        {article.content.tip && (
          <div className="bg-green-50 border-r-4 border-green-400 rounded-[16px] p-5 mb-4 flex gap-3">
            <Lightbulb size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-right">
              <p className="font-black text-green-800 text-[13px] mb-1">نصيحة مفيدة</p>
              <p className="text-green-700 text-[13px] font-bold leading-relaxed">{article.content.tip}</p>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-l from-[#1565C0] to-[#2196F3] rounded-[24px] p-6 text-right text-white mt-4">
          <h3 className="font-black text-[17px] mb-2">هل تحتاج لمساعدة فورية؟</h3>
          <p className="text-white/85 text-[13px] font-bold mb-4">متطوعون ومتخصصون متاحون 24/7 للاستماع إليك.</p>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-white text-[#2196F3] font-black text-[13px] px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all">
              اتصل بالطوارئ
            </button>
            <button
              onClick={() => router.back()}
              className="border border-white/50 text-white font-black text-[13px] px-6 py-2.5 rounded-xl hover:bg-white/10 transition-all"
            >
              عودة للدليل
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
