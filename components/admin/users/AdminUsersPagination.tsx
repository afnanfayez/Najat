'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  formatAdminUsersRange,
  getAdminUsersTotalPages,
} from '../data/adminUsersService'
import { ADMIN_USERS_BLUE, ADMIN_USERS_FONT } from './adminUsersStyles'

interface AdminUsersPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

function getPageItems(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const items: (number | 'ellipsis')[] = [1]

  if (page > 3) {
    items.push('ellipsis')
  }

  const rangeStart = Math.max(2, page - 1)
  const rangeEnd = Math.min(totalPages - 1, page + 1)

  for (let p = rangeStart; p <= rangeEnd; p += 1) {
    items.push(p)
  }

  if (page < totalPages - 2) {
    items.push('ellipsis')
  }

  items.push(totalPages)

  return items
}

function PageArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ChevronRight : ChevronLeft

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-35"
      style={{ color: ADMIN_USERS_BLUE }}
      aria-label={direction === 'prev' ? 'الصفحة السابقة' : 'الصفحة التالية'}
    >
      <Icon size={18} strokeWidth={2.5} />
    </button>
  )
}

export default function AdminUsersPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: AdminUsersPaginationProps) {
  const totalPages = getAdminUsersTotalPages(total, pageSize)
  const pageItems = getPageItems(page, totalPages)

  return (
    <div
      className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
      style={{
        borderTop: '1px solid #2196F34A',
        background: '#2196F31A',
      }}
    >
      <p
        className="text-right text-sm font-semibold"
        style={{ fontFamily: ADMIN_USERS_FONT, color: ADMIN_USERS_BLUE }}
      >
        {formatAdminUsersRange(page, pageSize, total)}
      </p>

      <div className="flex items-center justify-center gap-1 sm:justify-end">
        <PageArrow
          direction="prev"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />

        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm font-bold"
              style={{ color: ADMIN_USERS_BLUE, fontFamily: ADMIN_USERS_FONT }}
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${item}-${index}`}
              type="button"
              onClick={() => onPageChange(item)}
              className="flex h-8 min-w-8 items-center justify-center px-2 text-sm font-bold transition-colors"
              style={{
                fontFamily: ADMIN_USERS_FONT,
                background: item === page ? ADMIN_USERS_BLUE : 'transparent',
                color: item === page ? '#fff' : ADMIN_USERS_BLUE,
                borderRadius: item === page ? '8px' : '0',
              }}
            >
              {item}
            </button>
          ),
        )}

        <PageArrow
          direction="next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  )
}
