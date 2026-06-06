'use client'

import { ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ADMIN_AUDIT_BLUE,
  ADMIN_AUDIT_FONT,
  ADMIN_AUDIT_INPUT_BG,
  ADMIN_AUDIT_LABEL_STYLE,
} from './adminAuditStyles'

interface AdminAuditSelectFieldProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
}

function SelectChevronIcon() {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{
        border: `1px solid ${ADMIN_AUDIT_BLUE}`,
        background: ADMIN_AUDIT_INPUT_BG,
      }}
    >
      <ChevronDown size={11} style={{ color: ADMIN_AUDIT_BLUE }} strokeWidth={2.5} />
    </span>
  )
}

export default function AdminAuditSelectField({
  label,
  value,
  onValueChange,
  options,
}: AdminAuditSelectFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 text-right">
      <label style={ADMIN_AUDIT_LABEL_STYLE}>{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className="h-11 w-full justify-start border-none shadow-none focus:ring-0 [&>svg:last-child]:hidden"
          style={{
            fontFamily: ADMIN_AUDIT_FONT,
            background: ADMIN_AUDIT_INPUT_BG,
            color: ADMIN_AUDIT_BLUE,
          }}
        >
          <div dir="rtl" className="flex w-full items-center justify-start gap-1.5">
            <SelectChevronIcon />
            <SelectValue
              placeholder="الكل"
              className="font-semibold text-right"
              style={{ color: ADMIN_AUDIT_BLUE }}
            />
          </div>
        </SelectTrigger>
        <SelectContent align="end">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
