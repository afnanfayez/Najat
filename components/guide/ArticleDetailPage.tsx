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
import GuideQueryState from './GuideQueryState'
import { useArticle } from '@/hooks/useArticle'
import { getCategoryLabel, formatViewsCount } from '@/lib/mappers/article'
import { downloadArticlePdf } from '@/lib/utils/articlePdf'
import type { Article } from '@/schemas/healthGuide'

interface Props {
  articleId: string
  initialArticle?: Article | null
  onBack?: () => void
}

export default function ArticleDetailPage({ articleId, initialArticle = null, onBack }: Props) {
  const router = useRouter()
  const { data: article, isLoading, isError, error, refetch } =
    useArticle(articleId, initialArticle)

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
    downloadArticlePdf(article)
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

  let displayContent = article?.content || ''
  let references: string[] = []

  const refIndex = displayContent.indexOf('---REFERENCES---')
  if (refIndex !== -1) {
    const rawRefs = displayContent.slice(refIndex + 16).trim()
    displayContent = displayContent.slice(0, refIndex).trim()
    if (rawRefs) {
      references = rawRefs
        .split(/\n+/)
        .map((r) => r.trim())
        .filter(Boolean)
    }
  }

  const paragraphs =
    displayContent
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
          onClick={() => {
            if (onBack) {
              onBack()
              return
            }
            router.back()
          }}
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
                {article.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.image}
                    alt={article.title}
                    className="mb-6 aspect-[16/9] w-full rounded-[20px] object-cover shadow-sm"
                  />
                )}
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

                  {references.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100 text-right">
                      <h3 className="text-[16px] sm:text-[18px] font-black text-slate-800 mb-3">المراجع والمصادر:</h3>
                      <ul className="list-disc list-inside flex flex-col gap-2">
                        {references.map((ref, idx) => {
                          const isUrl = ref.startsWith('http://') || ref.startsWith('https://')
                          return (
                            <li key={idx} className="text-slate-600 text-sm font-bold">
                              {isUrl ? (
                                <a
                                  href={ref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#2196F3] hover:underline break-all"
                                >
                                  {ref}
                                </a>
                              ) : (
                                ref
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
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
                    onClick={() => {
                      if (onBack) {
                        onBack()
                        return
                      }
                      router.back()
                    }}
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
