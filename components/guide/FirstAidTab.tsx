'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, ChevronLeft, Eye, Clock } from 'lucide-react'
import Image from 'next/image'
import GuideQueryState from './GuideQueryState'
import { useHealthGuideArticles } from '@/hooks/useHealthGuideArticles'
import { MENTAL_TOOLS } from '@/lib/guide/mentalHealthContent'
import ArticleDetailPage from './ArticleDetailPage'
import type { Article } from '@/schemas/healthGuide'
import {
  formatReadTimeLabel,
  formatViewsCount,
} from '@/lib/mappers/article'

interface Props {
  query: string
}

export default function FirstAidTab({ query }: Props) {
  const router = useRouter()
  const [offlineArticle, setOfflineArticle] = useState<Article | null>(null)
  const {
    data: firstAidCards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useHealthGuideArticles({ category: 'first-aid', search: query })

  const {
    data: awarenessArticles = [],
    isLoading: awarenessLoading,
    isError: awarenessError,
    error: awarenessErr,
    refetch: refetchAwareness,
  } = useHealthGuideArticles({ category: 'articles' })

  const openArticle = (article: Article) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOfflineArticle(article)
      return
    }
    router.push(`/health-guide/article/${article.id}`)
  }

  if (offlineArticle) {
    return (
      <ArticleDetailPage
        articleId={offlineArticle.id}
        initialArticle={offlineArticle}
        onBack={() => setOfflineArticle(null)}
      />
    )
  }

  return (
    <>
      <GuideQueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && firstAidCards.length === 0}
        emptyMessage="لا توجد نتائج مطابقة"
        onRetry={() => refetch()}
      >
        <div className="mb-8 sm:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {firstAidCards.map((card) => (
              <div
                key={card.id}
                className="group relative h-[220px] sm:h-[280px] rounded-[24px] overflow-hidden shadow-lg shadow-blue-900/5 transition-transform hover:-translate-y-1 cursor-pointer"
                onClick={() => openArticle(card)}
              >
                <Image
                  src={card.image ?? '/assets/healthcare1.jpg'}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-right">
                  <h3 className="text-white text-xl sm:text-2xl font-black mb-1.5 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-white/90 text-[12px] sm:text-[14px] font-black mb-4 leading-relaxed line-clamp-1">
                    {card.desc}
                  </p>
                  <button
                    type="button"
                    className="bg-[#2196F3] text-white py-2.5 rounded-xl font-black text-[12px] sm:text-[13px] hover:bg-blue-600 transition-all shadow-md w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      openArticle(card)
                    }}
                  >
                    انتقل الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GuideQueryState>

      <div className="mb-8 sm:mb-10 w-full">
        <div
          className="bg-white rounded-[40px] p-8 sm:p-10 border-2 border-slate-50 shadow-sm flex flex-col lg:flex-row items-center justify-between w-full gap-10"
          style={{ direction: 'rtl' }}
        >
          <div className="flex flex-col items-start text-right w-full lg:flex-1">
            <div
              className="px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-2 mb-4 text-white w-fit"
              style={{ background: '#459F49' }}
            >
              <span className="w-2 h-2 bg-white rounded-full" />
              مستشار متاح الآن
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4">
              ركن الصحة النفسية
            </h2>
            <p className="text-black text-[15px] sm:text-[19px] font-black leading-relaxed mb-8 w-full">
              نحن هنا لدعمك في تجاوز الأزمات النفسية والتوتر الناتج عن الظروف
              الصعبة. لا تتردد في طلب المساعدة.
            </p>
            <button
              type="button"
              className="bg-[#2196F3] text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-[16px] flex items-center gap-3 shadow-lg hover:bg-blue-600 transition-all w-fit"
            >
              <Phone size={20} />
              اتصال هاتفي
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            {MENTAL_TOOLS.map((tool, i) => (
              <button
                key={i}
                type="button"
                className="w-[120px] h-[90px] sm:w-[150px] sm:h-[110px] bg-[#2196F3] rounded-[18px] flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md shadow-blue-100"
              >
                <img
                  src={tool.icon}
                  alt={tool.label}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-white text-[11px] font-black">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-right">
        <h2 className="text-xl sm:text-2xl font-black text-[#1e293b] mb-4">
          مقالات توعوية
        </h2>
        <GuideQueryState
          isLoading={awarenessLoading}
          isError={awarenessError}
          error={awarenessErr}
          isEmpty={!awarenessLoading && awarenessArticles.length === 0}
          emptyMessage="لا توجد مقالات توعوية حالياً"
          onRetry={() => refetchAwareness()}
        >
          <div className="flex flex-col gap-4">
            {awarenessArticles.slice(0, 6).map((article) => (
              <div
                key={article.id}
                onClick={() => openArticle(article)}
                className="bg-white rounded-[20px] border-2 border-slate-50 p-3 sm:p-4 flex items-center gap-4 group cursor-pointer hover:border-blue-100 transition-all shadow-sm"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={article.image ?? '/assets/artical.png'}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 text-right flex flex-col gap-1">
                  <h3 className="text-[15px] sm:text-[18px] font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-start gap-5 text-slate-500 text-[13px] font-black">
                    <div className="flex items-center gap-1.5">
                      <Eye size={16} />
                      {formatViewsCount(article.viewsCount ?? 0)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      {formatReadTimeLabel(article.readTime)}
                    </div>
                  </div>
                </div>
                <ChevronLeft className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
            ))}
          </div>
        </GuideQueryState>
      </div>
    </>
  )
}
