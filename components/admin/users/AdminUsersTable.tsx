'use client'

import type { ReactNode } from 'react'
import { Pencil, RotateCcw, Trash2 } from 'lucide-react'
import AdminUsersToggle from './AdminUsersToggle'
import { ADMIN_USERS_BLUE, ADMIN_USERS_FONT } from './adminUsersStyles'
import type { AdminManagedUser } from '@/schemas/adminUser'

interface AdminUsersTableProps {
  users: AdminManagedUser[]
  enabledOverrides: Record<string, boolean>
  onToggleUser: (userId: string, enabled: boolean, userName: string) => void
  onEditUser: (user: AdminManagedUser) => void
  onRestoreUser?: (userId: string, userName: string) => void
  onDeleteUser?: (userId: string, userName: string) => void
  pagination?: ReactNode
}

const thClass =
  'w-[16.666%] px-4 py-4 text-center text-[13px] font-semibold text-[#7E7D7D]'
const tdClass = 'w-[16.666%] px-4 py-4 align-middle'
const cellTextClass = 'text-[14px] font-medium text-black'

export default function AdminUsersTable({
  users,
  enabledOverrides,
  onToggleUser,
  onEditUser,
  onRestoreUser,
  onDeleteUser,
  pagination,
}: AdminUsersTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-right">
            <colgroup>
              <col className="w-[16.666%]" />
              <col className="w-[16.666%]" />
              <col className="w-[16.666%]" />
              <col className="w-[16.666%]" />
              <col className="w-[16.666%]" />
              <col className="w-[16.666%]" />
            </colgroup>
            <thead>
              <tr style={{ background: '#2196F31A' }}>
                <th className={`${thClass} !text-right`}>المستخدم</th>
                <th className={thClass}>الدور الوظيفي</th>
                <th className={thClass}>المنطقة</th>
                <th className={thClass}>الحالة</th>
                <th className={thClass}>آخر نشاط</th>
                <th className={thClass} aria-label="إجراء" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const enabled = enabledOverrides[user.id] ?? user.enabled
                const displayStatus = enabled ? user.statusLabel : 'معطل'
                const displayColor  = enabled ? user.statusColor  : '#F44336'
                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#EEF2F7] last:border-b-0"
                  >
                    <td className={`${tdClass} text-right`}>
                      <div>
                        <p
                          className="text-[15px] font-bold text-[#1e293b]"
                          style={{ fontFamily: ADMIN_USERS_FONT }}
                        >
                          {user.name}
                        </p>
                        <p
                          className="mt-1 text-[13px] text-[#94A3B8]"
                          style={{ fontFamily: ADMIN_USERS_FONT }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td
                      className={`${tdClass} text-center ${cellTextClass}`}
                      style={{ fontFamily: ADMIN_USERS_FONT }}
                    >
                      {user.roleLabel}
                    </td>
                    <td
                      className={`${tdClass} text-center ${cellTextClass}`}
                      style={{ fontFamily: ADMIN_USERS_FONT }}
                    >
                      {user.region}
                    </td>
                    <td className={`${tdClass} text-center`}>
                      <span
                        className="text-[14px] font-bold"
                        style={{ color: displayColor, fontFamily: ADMIN_USERS_FONT }}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td
                      className={`${tdClass} text-center ${cellTextClass}`}
                      style={{ fontFamily: ADMIN_USERS_FONT }}
                    >
                      {user.lastActivity}
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center justify-center gap-3">
                        {user.deletedAt ? (
                          <button
                            type="button"
                            onClick={() => onRestoreUser?.(user.id, user.name)}
                            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold transition-colors hover:bg-[#22C55E]/10"
                            style={{ color: '#22C55E', fontFamily: ADMIN_USERS_FONT }}
                            aria-label={`استعادة ${user.name}`}
                          >
                            <RotateCcw size={14} strokeWidth={2.5} />
                            استعادة
                          </button>
                        ) : (
                          <>
                            <AdminUsersToggle
                              checked={enabled}
                              onChange={(next) => onToggleUser(user.id, next, user.name)}
                            />
                            <button
                              type="button"
                              onClick={() => onEditUser(user)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#2196F3]/10"
                              style={{ color: ADMIN_USERS_BLUE }}
                              aria-label={`تعديل ${user.name}`}
                            >
                              <Pencil size={17} strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteUser?.(user.id, user.name)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F44336]/10"
                              style={{ color: '#F44336' }}
                              aria-label={`حذف ${user.name}`}
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {pagination}
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {users.map((user) => {
          const enabled = enabledOverrides[user.id] ?? user.enabled
          const displayStatus = enabled ? user.statusLabel : 'معطل'
          const displayColor  = enabled ? user.statusColor  : '#F44336'
          return (
            <div
              key={user.id}
              className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 text-right">
                  <p
                    className="text-base font-bold text-[#1e293b]"
                    style={{ fontFamily: ADMIN_USERS_FONT }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="mt-1 break-all text-xs text-[#94A3B8]"
                    style={{ fontFamily: ADMIN_USERS_FONT }}
                  >
                    {user.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {user.deletedAt ? (
                    <button
                      type="button"
                      onClick={() => onRestoreUser?.(user.id, user.name)}
                      className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold transition-colors hover:bg-[#22C55E]/10"
                      style={{ color: '#22C55E', fontFamily: ADMIN_USERS_FONT }}
                      aria-label={`استعادة ${user.name}`}
                    >
                      <RotateCcw size={14} strokeWidth={2.5} />
                      استعادة
                    </button>
                  ) : (
                    <>
                      <AdminUsersToggle
                        checked={enabled}
                        onChange={(next) => onToggleUser(user.id, next, user.name)}
                      />
                      <button
                        type="button"
                        onClick={() => onEditUser(user)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#2196F3]/10"
                        style={{ color: ADMIN_USERS_BLUE }}
                        aria-label={`تعديل ${user.name}`}
                      >
                        <Pencil size={17} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUser?.(user.id, user.name)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F44336]/10"
                        style={{ color: '#F44336' }}
                        aria-label={`حذف ${user.name}`}
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-right">
                <div>
                  <p className="text-xs text-[#94A3B8]">الدور الوظيفي</p>
                  <p
                    className={`mt-1 text-sm font-semibold ${cellTextClass}`}
                    style={{ fontFamily: ADMIN_USERS_FONT }}
                  >
                    {user.roleLabel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">المنطقة</p>
                  <p
                    className={`mt-1 text-sm font-semibold ${cellTextClass}`}
                    style={{ fontFamily: ADMIN_USERS_FONT }}
                  >
                    {user.region}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">الحالة</p>
                  <p
                    className="mt-1 text-sm font-bold"
                    style={{ color: displayColor, fontFamily: ADMIN_USERS_FONT }}
                  >
                    {displayStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">آخر نشاط</p>
                  <p
                    className={`mt-1 text-sm font-medium ${cellTextClass}`}
                    style={{ fontFamily: ADMIN_USERS_FONT }}
                  >
                    {user.lastActivity}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        {pagination ? (
          <div className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white">
            {pagination}
          </div>
        ) : null}
      </div>
    </>
  )
}
