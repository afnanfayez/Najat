'use client'

import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'
import type { AdminMapsEditorIntegrity, AdminMapsEditorLayer } from '@/schemas/adminMaps'
import { ADMIN_MAPS_BLUE, ADMIN_MAPS_FONT } from '../adminMapsStyles'

export type AdminMapsDrawTool = 'safe' | 'alternative' | 'danger' | null

const DRAW_TOOLS: {
  id: Exclude<AdminMapsDrawTool, null>
  label: string
  icon: typeof CheckCircle2
  color: string
  bg: string
}[] = [
  {
    id: 'safe',
    label: 'مسار آمن',
    icon: CheckCircle2,
    color: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    id: 'alternative',
    label: 'مسار بديل',
    icon: ArrowUpDown,
    color: '#2196F3',
    bg: '#EBF5FF',
  },
  {
    id: 'danger',
    label: 'طريق خطر',
    icon: AlertTriangle,
    color: '#EF4444',
    bg: '#FEF2F2',
  },
]

interface AdminMapsEditorToolsPanelProps {
  layers: AdminMapsEditorLayer[]
  integrity: AdminMapsEditorIntegrity
  activeTool: AdminMapsDrawTool
  onToolChange: (tool: AdminMapsDrawTool) => void
  onLayerToggle: (layerId: string) => void
  onUploadMap?: (file: File) => void
  /** Called before opening the file picker — saves any currently drawn shape */
  onSaveCurrentShape?: () => void
}

export default function AdminMapsEditorToolsPanel({
  layers,
  integrity,
  activeTool,
  onToolChange,
  onLayerToggle,
  onUploadMap,
  onSaveCurrentShape,
}: AdminMapsEditorToolsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleUploadClick() {
    // Save any currently drawn shape before opening the file picker
    if (onSaveCurrentShape) onSaveCurrentShape()
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (onUploadMap) {
      onUploadMap(file)
    } else {
      toast.success(`تم اختيار الخريطة: ${file.name}`, { position: 'top-center' })
    }
    e.target.value = ''
  }

  return (
    <aside
      className="flex h-auto flex-col gap-4 rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:gap-5 sm:p-5 xl:h-full"
      dir="rtl"
    >
      <section>
        <h2
          className="mb-3 text-right text-sm font-bold text-[#0F172A] sm:text-base"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          أدوات الرسم التكتيكي
        </h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 xl:grid-cols-1">
          {DRAW_TOOLS.map((tool) => {
            const Icon = tool.icon
            const selected = activeTool === tool.id
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onToolChange(selected ? null : tool.id)}
                className="flex items-center justify-start gap-3 rounded-2xl border-2 px-3 py-3 text-right transition-all sm:px-4 sm:py-3.5"
                style={{
                  borderColor: selected ? tool.color : '#E8EEF5',
                  background: selected ? tool.bg : '#fff',
                }}
              >
                <Icon size={22} style={{ color: tool.color }} strokeWidth={2} />
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: ADMIN_MAPS_FONT,
                    color: selected ? tool.color : '#0F172A',
                  }}
                >
                  {tool.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="h-px bg-[#E8EEF5]" />

      <section>
        <h2
          className="mb-3 text-right text-sm font-bold text-[#0F172A] sm:text-base"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          طبقات الخريطة النشطة
        </h2>
        <div className="flex flex-col gap-3">
          {layers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => onLayerToggle(layer.id)}
              className="flex items-center justify-between gap-3 text-right"
            >
              <div className="flex min-w-0 flex-1 items-center justify-start gap-2.5">
                <CheckCircle2
                  size={18}
                  className="shrink-0"
                  style={{ color: layer.active ? '#22C55E' : '#CBD5E1' }}
                  strokeWidth={2.5}
                />
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: layer.color }}
                />
                <span
                  className="text-sm font-bold text-[#334155]"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  {layer.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-[#E8EEF5]" />

      <section>
        <h2
          className="mb-3 text-right text-sm font-bold text-[#0F172A] sm:text-base"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          سلامة الخريطة
        </h2>
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span
                className="text-xs font-bold text-[#22C55E]"
                style={{ fontFamily: ADMIN_MAPS_FONT }}
              >
                {integrity.fieldDataAccuracy}%
              </span>
              <span
                className="text-xs font-bold text-[#64748B]"
                style={{ fontFamily: ADMIN_MAPS_FONT }}
              >
                دقة البيانات الميدانية
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E8EEF5]">
              <div
                className="h-full rounded-full bg-[#22C55E]"
                style={{ width: `${integrity.fieldDataAccuracy}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs font-bold text-[#2196F3]"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              {integrity.lastUpdateMinutes} دقيقة
            </span>
            <span
              className="text-xs font-bold text-[#64748B]"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              وقت التحديث الأخير
            </span>
          </div>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept=".geojson,.json,.kml,.gpx"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleUploadClick}
        className="mt-auto w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
      >
        رفع خريطة أساس جديدة
      </button>
    </aside>
  )
}
