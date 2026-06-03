'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Clock,
  Share2,
  Download,
  Bookmark,
  Eye,
  User,
} from 'lucide-react'
import GuideQueryState, { buildArticlePrintHtml } from './GuideQueryState'
import { useArticle } from '@/hooks/useArticle'
import { getCategoryLabel, formatViewsCount } from '@/lib/mappers/article'

interface Props {
  articleId: string
}

export default function ArticleDetailPage({ articleId }: Props) {
  const router = useRouter()
  const { data: article, isLoading, isError, error, refetch } =
    useArticle(articleId)

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!article) return
    const saved: string[] = JSON.parse(
      localStorage.getItem('saved-articles') || '[]',
    )
    setIsSaved(saved.includes(article.id))
  }, [article])

  const handleShare = async () => {
    if (!article) return
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.desc,
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      // Ignored
    }
  }

  const handleDownload = () => {
    if (!article) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(buildArticlePrintHtml(article))
    printWindow.document.close()
  }

  const handleSave = () => {
    if (!article) return
    const saved: string[] = JSON.parse(
      localStorage.getItem('saved-articles') || '[]',
    )
    if (saved.includes(article.id)) {
      const updated = saved.filter((id) => id !== article.id)
      localStorage.setItem('saved-articles', JSON.stringify(updated))
      setIsSaved(false)
    } else {
      localStorage.setItem(
        'saved-articles',
        JSON.stringify([...saved, article.id]),
      )
      setIsSaved(true)
    }
  }

  const paragraphs =
    article?.content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean) ?? []

  return (
    <div
      className="h-screen w-full overflow-y-auto no-scrollbar"
      style={{
        direction: 'rtl',
        fontFamily: "'Cairo', sans-serif",
        background: '#F4F7FB',
      }}
    >
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#2196F3] font-black text-[14px] hover:gap-3 transition-all"
        >
          <ArrowRight size={18} />
          عودة للدليل الصحي
        </button>
        {article && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              aria-label="مشاركة"
              className="p-2 rounded-xl hover:bg-blue-50 text-[#2196F3] transition-colors"
            >
              <Share2 size={18} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              aria-label="تحميل"
              className="p-2 rounded-xl hover:bg-blue-50 text-[#2196F3] transition-colors"
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              onClick={handleSave}
              aria-label="حفظ"
              className={`p-2 rounded-xl transition-colors ${isSaved ? 'bg-blue-50 text-[#2196F3]' : 'hover:bg-blue-50 text-slate-400'}`}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 pb-16">
        <GuideQueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!article && !isLoading && !isError}
          emptyMessage="المقال غير موجود"
          onRetry={() => refetch()}
        >
          {article && (
            <>
              <div className="mb-6">
                <span className="inline-block bg-[#2196F3]/10 text-[#2196F3] text-[11px] font-black px-3 py-1 rounded-full mb-3">
                  {getCategoryLabel(article.category)}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] mb-3 leading-snug">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[13px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{article.readTime} قراءة</span>
                  </div>
                  {article.viewsCount != null && (
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} />
                      <span>{formatViewsCount(article.viewsCount)}</span>
                    </div>
                  )}
                  {article.authorName && (
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      <span>{article.authorName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[20px] border border-slate-100 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col gap-5 text-right">
                  {paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-slate-700 text-[14px] sm:text-[16px] font-bold leading-relaxed whitespace-pre-wrap"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-l from-[#1565C0] to-[#2196F3] rounded-[24px] p-6 text-right text-white mt-6">
                <h3 className="font-black text-[17px] mb-2">
                  هل تحتاج لمساعدة فورية؟
                </h3>
                <p className="text-white/85 text-[13px] font-bold mb-4">
                  متطوعون ومتخصصون متاحون 24/7 للاستماع إليك.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="button"
                    className="bg-white text-[#2196F3] font-black text-[13px] px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all"
                  >
                    اتصل بالطوارئ
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="border border-white/50 text-white font-black text-[13px] px-6 py-2.5 rounded-xl hover:bg-white/10 transition-all"
                  >
                    عودة للدليل
                  </button>
                </div>
              </div>
            </>
          )}
        </GuideQueryState>
      </div>
    </div>
  )
}
