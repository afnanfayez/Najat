'use client'

import { useRouter } from 'next/navigation'

interface AdminAuditBackButtonProps {
  href?: string
}

export default function AdminAuditBackButton({ href = '/admin/audit' }: AdminAuditBackButtonProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="mb-4"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#2196F3',
        fontFamily: "'Cairo', sans-serif",
        fontWeight: 700,
        fontSize: '15px',
        padding: '4px 0',
        direction: 'ltr',
        width: 'fit-content',
      }}
    >
      رجوع
      <span style={{ fontSize: '20px', lineHeight: 1 }}>›</span>
    </button>
  )
}
