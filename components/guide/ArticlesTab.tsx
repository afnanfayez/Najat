'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Share2, Download, Bookmark } from 'lucide-react'
import GuideQueryState, { buildArticlePrintHtml } from './GuideQueryState'
import { useHealthGuideArticles } from '@/hooks/useHealthGuideArticles'
import type { Article } from '@/schemas/healthGuide'
import ArticleDetailPage from './ArticleDetailPage'

interface Props {
  query: string
}

export default function ArticlesTab({ query }: Props) {
  const router = useRouter()
  const {
    data: list = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useHealthGuideArticles({ category: 'articles', search: query })

  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const [offlineArticle, setOfflineArticle] = useState<Article | null>(null)

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

  const handleDownload = (article: Article) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(buildArticlePrintHtml(article))
    printWindow.document.close()
  }

  const handleSave = (id: string) => {
    const saved = [...savedArticles]
    if (saved.includes(id)) {
      const updated = saved.filter((s) => s !== id)
      setSavedArticles(updated)
      localStorage.setItem('saved-articles', JSON.stringify(updated))
    } else {
      const updated = [...saved, id]
      setSavedArticles(updated)
      localStorage.setItem('saved-articles', JSON.stringify(updated))
    }
  }

  const isSaved = (id: string) => savedArticles.includes(id)

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
    <GuideQueryState
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!isLoading && list.length === 0}
      emptyMessage="لا توجد نتائج مطابقة للبحث"
      onRetry={() => refetch()}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {list.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-[20px] border border-slate-100 p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer"
          >
            <div
              className="flex flex-col gap-1.5 text-right"
              onClick={() => openArticle(article)}
            >
              <h3 className="text-[15px] sm:text-[17px] font-black text-black group-hover:text-[#2196F3] transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-black/70 text-[12px] sm:text-[13px] font-bold leading-relaxed">
                {article.desc}
              </p>
            </div>

            <div
              className="flex items-center justify-between mt-1"
              style={{ direction: 'ltr' }}
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="مشاركة"
                  onClick={() =>
                    handleShare(article.id, article.title, article.desc)
                  }
                  className="text-[#2196F3] hover:text-blue-700 transition-colors"
                >
                  <Share2 size={18} />
                </button>
                <button
                  type="button"
                  aria-label="تحميل"
                  onClick={() => handleDownload(article)}
                  className="text-[#2196F3] hover:text-blue-700 transition-colors"
                >
                  <Download size={18} />
                </button>
                <button
                  type="button"
                  aria-label="حفظ"
                  onClick={() => handleSave(article.id)}
                  className={`transition-colors ${isSaved(article.id) ? 'text-blue-600' : 'text-[#2196F3] hover:text-blue-700'}`}
                >
                  <Bookmark
                    size={18}
                    fill={isSaved(article.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={() => openArticle(article)}
                className="bg-[#2196F3] text-white text-[12px] sm:text-[13px] font-black px-8 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-sm min-w-[120px] text-center"
              >
                انتقل الآن
              </button>
            </div>
          </div>
        ))}
      </div>
    </GuideQueryState>
  )
}
