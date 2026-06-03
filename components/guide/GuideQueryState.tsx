'use client'

import React from 'react'

function queryErrorInfo(err: unknown): { status?: number; message: string } {
  if (err && typeof err === 'object' && 'message' in err) {
    const o = err as {
      status?: number
      message?: unknown
      errors?: Array<{ field?: string; message?: unknown }> | null
    }
    const raw = o.message
    if (typeof raw === 'string' && raw.startsWith('[')) {
      return {
        status: o.status,
        message: 'تعذّر قراءة بيانات المقالات من الخادم',
      }
    }

    if (Array.isArray(o.errors) && o.errors.length > 0) {
      const first = o.errors[0]
      const fieldMsg = first?.message
      const detail =
        typeof fieldMsg === 'object' && fieldMsg !== null
          ? ((fieldMsg as { ar?: string }).ar ??
            (fieldMsg as { en?: string }).en)
          : typeof fieldMsg === 'string'
            ? fieldMsg
            : undefined
      if (detail) {
        return {
          status: o.status,
          message: first.field ? `${first.field}: ${detail}` : detail,
        }
      }
    }

    const message =
      typeof raw === 'string'
        ? raw
        : raw != null && typeof raw !== 'object'
          ? String(raw)
          : 'حدث خطأ غير متوقع'
    return { status: o.status, message }
  }
  return { message: 'حدث خطأ غير متوقع' }
}

interface GuideQueryStateProps {
  isLoading: boolean
  isError: boolean
  error: unknown
  isEmpty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  children: React.ReactNode
}

export default function GuideQueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'لا توجد نتائج مطابقة',
  onRetry,
  children,
}: GuideQueryStateProps) {
  if (isLoading) {
    return (
      <p
        className="text-center font-bold py-20"
        style={{ color: '#7E7D7D', fontFamily: "'Cairo', sans-serif" }}
      >
        جارٍ التحميل...
      </p>
    )
  }

  if (isError) {
    const { status, message } = queryErrorInfo(error)
    return (
      <div
        className="text-center py-16 flex flex-col items-center gap-4"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <p className="text-slate-600 font-bold text-[15px]">
          {status === 401 ? 'يرجى تسجيل الدخول للوصول إلى المقالات' : message}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="bg-[#2196F3] text-white font-black text-[13px] px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-all"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <p className="text-center text-slate-400 font-bold py-20">{emptyMessage}</p>
    )
  }

  return <>{children}</>
}

export function buildArticlePrintHtml(article: {
  title: string
  readTime: string
  content: string
  authorName?: string
}): string {
  const paragraphs = article.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('')

  const authorLine = article.authorName
    ? ` • الكاتب: ${article.authorName}`
    : ''

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar"><head><meta charset="UTF-8"/><title>${article.title}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Cairo',Arial,sans-serif;direction:rtl;padding:40px;color:#1e293b;max-width:800px;margin:0 auto;font-size:14px;line-height:1.8}
h1{color:#2196F3;font-size:22px;margin-bottom:6px;font-weight:900}.meta{color:#64748b;font-size:12px;margin-bottom:18px;border-bottom:2px solid #e2e8f0;padding-bottom:10px}
.content p{margin-bottom:14px;color:#334155;font-size:14px;line-height:1.9}
@media print{body{padding:20px}}</style></head>
<body><h1>${article.title}</h1>
<div class="meta">وقت القراءة: ${article.readTime}${authorLine} • المصدر: نجاة – الدليل الصحي</div>
<div class="content">${paragraphs}</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
</body></html>`
}
