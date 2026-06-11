'use client'

import React from 'react'
import Link from 'next/link'
import FacilityCard from '@/components/health/FacilityCard'
import { HealthFacility } from '@/schemas/healthFacility'

function facilityQueryErrorInfo(err: unknown): {
  status?: number
  message: string
} {
  if (err && typeof err === 'object' && 'message' in err) {
    const o = err as { status?: number; message?: unknown }
    const raw = o.message
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

interface FacilityGridProps {
  isLoading: boolean
  facilities: HealthFacility[] | undefined
  onNavigate: (facility: HealthFacility) => void
  onCall: (facility: HealthFacility) => void
  queryError?: unknown
  onRetry?: () => void
  isBackgroundRefreshing?: boolean
}

export default function FacilityGrid({
  isLoading,
  facilities,
  onNavigate,
  onCall,
  queryError,
  onRetry,
  isBackgroundRefreshing,
}: FacilityGridProps) {
  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7E7D7D',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 600,
          fontSize: '16px',
        }}
      >
        جارٍ التحميل...
      </div>
    )
  }

  if (queryError) {
    const { status, message } = facilityQueryErrorInfo(queryError)
    const isUnauthorized = status === 401
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '24px 16px',
          color: '#424242',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 600,
          fontSize: '15px',
          textAlign: 'center',
        }}
      >
        {isUnauthorized ? (
          <>
            <span>يجب تسجيل الدخول لعرض المستشفيات والموقع القريب منك.</span>
            <Link
              href="/login"
              style={{ color: '#2196F3', textDecoration: 'underline' }}
            >
              الانتقال إلى تسجيل الدخول
            </Link>
          </>
        ) : (
          <span>تعذر تحميل البيانات.{message ? ` ${message}` : ''}</span>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={() => onRetry()}
            style={{
              marginTop: 4,
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#2196F3',
              color: '#fff',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    )
  }

  if (!facilities?.length) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: '#9E9E9E',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 600,
          fontSize: '15px',
          textAlign: 'center',
        }}
      >
        <span>
          {isBackgroundRefreshing
            ? 'الاتصال بطيء، سنحدّث البيانات تلقائياً عند توفرها'
            : 'لا توجد نتائج'}
        </span>
        {isBackgroundRefreshing && onRetry ? (
          <button
            type="button"
            onClick={() => onRetry()}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#2196F3',
              color: '#fff',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            إعادة المحاولة
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className="health-grid custom-scrollbar"
      style={{
        overflowY: 'auto',
        paddingBottom: '28px',
        flex: 1,
        alignContent: 'start',
      }}
    >
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
          onNavigate={onNavigate}
          onCall={onCall}
        />
      ))}
    </div>
  )
}
