'use client'

import { Plus, ShieldCheck } from 'lucide-react'
import type { AdminSecurityBackupItem } from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_BLUE,
  ADMIN_SECURITY_CARD_SHELL,
  ADMIN_SECURITY_CARD_SHADOW,
  ADMIN_SECURITY_FONT,
  ADMIN_SECURITY_INPUT_BG,
} from '../adminSecurityStyles'

interface AdminSecurityBackupTableCardProps {
  title: string
  subtitle: string
  newBackupLabel: string
  publishLabel: string
  backups: AdminSecurityBackupItem[]
  onNewBackup?: () => void
  onPublish?: (backupId: string) => void
}

export default function AdminSecurityBackupTableCard({
  title,
  subtitle,
  newBackupLabel,
  publishLabel,
  backups,
  onNewBackup,
  onPublish,
}: AdminSecurityBackupTableCardProps) {
  return (
    <section
      className={`${ADMIN_SECURITY_CARD_SHELL} min-w-0 py-3 sm:py-4`}
      style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
      dir="rtl"
    >
      <div className="mb-3 flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h3 className="break-words text-sm font-bold text-[#0F172A] sm:text-base">{title}</h3>
          <p className="mt-0.5 break-words text-[11px] font-medium text-[#94A3B8] sm:text-xs">
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onNewBackup}
          className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white min-[480px]:w-auto sm:text-sm"
          style={{ background: ADMIN_SECURITY_BLUE, fontFamily: ADMIN_SECURITY_FONT }}
        >
          <Plus size={16} strokeWidth={2.5} />
          {newBackupLabel}
        </button>
      </div>

      <div className="hidden min-w-0 overflow-hidden lg:block">
        <table className="w-full table-fixed border-collapse text-right">
          <colgroup>
            <col style={{ width: '42%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '26%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[#E8EEF5]">
              <th className="pb-2 text-xs font-bold text-[#64748B]">الإصدار / الملف</th>
              <th className="pb-2 text-xs font-bold text-[#64748B]">الحجم</th>
              <th className="pb-2 text-center text-xs font-bold text-[#64748B]">فحص السلامة</th>
              <th className="pb-2 text-left text-xs font-bold text-[#64748B]">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((backup) => (
              <tr key={backup.id} className="border-b border-[#F1F5F9] last:border-0">
                <td className="py-2.5">
                  <p className="truncate text-xs font-bold text-[#0F172A] sm:text-sm">
                    {backup.version} - {backup.filename}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] font-medium text-[#94A3B8] sm:text-xs">
                    {backup.timestamp}
                  </p>
                </td>
                <td className="py-2.5 text-xs font-bold text-[#0F172A] sm:text-sm">{backup.size}</td>
                <td className="py-2.5 text-center">
                  {backup.integrityOk && (
                    <span className="inline-flex items-center justify-center">
                      <ShieldCheck size={20} className="text-[#22C55E]" strokeWidth={2.5} />
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-left">
                  <button
                    type="button"
                    onClick={() => onPublish?.(backup.id)}
                    className="whitespace-nowrap text-xs font-bold sm:text-sm"
                    style={{ color: ADMIN_SECURITY_BLUE }}
                  >
                    {publishLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        {backups.map((backup) => (
          <article
            key={backup.id}
            className="rounded-xl border border-[#E8EEF5] p-2.5 sm:p-3"
            style={{ background: ADMIN_SECURITY_INPUT_BG }}
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 text-right">
                <p className="break-words text-xs font-bold text-[#0F172A] sm:text-sm">
                  {backup.version} - {backup.filename}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">{backup.timestamp}</p>
              </div>
              {backup.integrityOk && (
                <ShieldCheck size={18} className="shrink-0 text-[#22C55E]" strokeWidth={2.5} />
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#64748B]">{backup.size}</span>
              <button
                type="button"
                onClick={() => onPublish?.(backup.id)}
                className="shrink-0 text-xs font-bold"
                style={{ color: ADMIN_SECURITY_BLUE }}
              >
                {publishLabel}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
